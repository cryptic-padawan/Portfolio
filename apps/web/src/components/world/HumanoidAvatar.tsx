"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei/core/Gltf";
import { useAnimations } from "@react-three/drei/core/useAnimations";
import { FBXLoader, SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { useAvatarStore } from "@/store/avatarStore";
import { isRpmAvatarUrl, LOCAL_DEFAULT_MODEL, RPM_ANIMATIONS } from "@/lib/rpmAssets";
import { useWorldStore } from "@/store/worldStore";
import { useFruitStore } from "@/store/fruitStore";
import { AvatarFruitProp } from "./AvatarFruitProp";

useGLTF.preload(LOCAL_DEFAULT_MODEL);

type Gait = "idle" | "walk" | "run";

/** Skinned meshes must be cloned with their skeleton, otherwise they stay bound to the original (detached) bones. */
function useSkinnedClone(scene: THREE.Object3D) {
  return useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.frustumCulled = false;
      }
    });
    return clone;
  }, [scene]);
}

function findClip(clips: THREE.AnimationClip[], gait: Gait) {
  return clips.find((c) => c.name.toLowerCase().includes(gait));
}

function findInteractionClip(clips: THREE.AnimationClip[]) {
  return clips.find((c) => /pick|grab|reach|eat|drink|interact/i.test(c.name));
}

function useGaitAnimations(clips: THREE.AnimationClip[], root: React.RefObject<THREE.Group | null>) {
  const isMoving = useWorldStore((s) => s.isMoving);
  const isRunning = useWorldStore((s) => s.isRunning);
  const consuming = useFruitStore((s) => s.phase === "consuming");
  const { actions } = useAnimations(clips, root);
  const current = useRef<THREE.AnimationAction | null>(null);

  const gait: Gait = consuming || !isMoving ? "idle" : isRunning ? "run" : "walk";

  useEffect(() => {
    const idle = findClip(clips, "idle");
    const walk = findClip(clips, "walk");
    const run = findClip(clips, "run") ?? walk;
    const interact = consuming ? findInteractionClip(clips) ?? idle : null;
    const pick = interact ?? (gait === "idle" ? idle : gait === "run" ? run : walk);
    const next = pick ? actions[pick.name] : null;

    if (!next) {
      current.current?.fadeOut(0.2);
      current.current = null;
      return;
    }

    next.setLoop(consuming ? THREE.LoopRepeat : THREE.LoopRepeat, Infinity);
    next.timeScale = consuming ? 0.85 : gait === "run" && run === walk ? 1.6 : 1;
    if (current.current !== next || !next.isRunning()) {
      next.reset().setEffectiveWeight(1).fadeIn(0.2).play();
      if (current.current !== next) current.current?.fadeOut(0.2);
      current.current = next;
    }
  }, [gait, consuming, actions, clips]);

  useEffect(
    () => () => {
      current.current = null;
    },
    [],
  );
}

function GltfHumanoid({ modelUrl }: { modelUrl: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelUrl);
  const model = useSkinnedClone(scene);
  useGaitAnimations(animations, group);

  return (
    <group ref={group} position={[0, -1.05, 0]} rotation={[0, Math.PI, 0]}>
      <primitive object={model} />
      <AvatarFruitProp model={model} />
    </group>
  );
}

function useFbxClip(url: string, name: Gait) {
  const fbx = useLoader(FBXLoader, url);
  return useMemo(() => {
    const clip = fbx.animations[0]?.clone();
    if (clip) clip.name = name;
    return clip;
  }, [fbx, name]);
}

function RpmHumanoid({ modelUrl }: { modelUrl: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);
  const model = useSkinnedClone(scene);
  const idleClip = useFbxClip(RPM_ANIMATIONS.idle, "idle");
  const walkClip = useFbxClip(RPM_ANIMATIONS.walk, "walk");
  const runClip = useFbxClip(RPM_ANIMATIONS.run, "run");

  const clips = useMemo(
    () => [idleClip, walkClip, runClip].filter(Boolean) as THREE.AnimationClip[],
    [idleClip, walkClip, runClip],
  );
  useGaitAnimations(clips, group);

  return (
    <group ref={group} position={[0, -1.05, 0]}>
      <primitive object={model} />
      <AvatarFruitProp model={model} />
    </group>
  );
}

export function HumanoidAvatar() {
  const modelUrl = useAvatarStore((s) => s.modelUrl);
  const rpm = isRpmAvatarUrl(modelUrl);

  return (
    <group key={modelUrl}>
      {rpm ? <RpmHumanoid modelUrl={modelUrl} /> : <GltfHumanoid modelUrl={modelUrl} />}
    </group>
  );
}
