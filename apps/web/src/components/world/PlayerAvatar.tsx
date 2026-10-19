"use client";



import { Suspense, useEffect, useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";

import { islandRuntime, setIslandPosition } from "@/lib/islandRuntime";

import { resolveObstacleCollisions } from "@/lib/islandForest";

import {

  avatarRootY,

  getSurfaceHeight,

  resolveSurfaceMovement,

} from "@/lib/islandSurfaces";

import { getTreeById } from "@/lib/islandForest";
import { useFruitStore } from "@/store/fruitStore";
import { useWorldStore } from "@/store/worldStore";
import { HumanoidAvatar } from "./HumanoidAvatar";
import { ProficiencyAchievementFloater } from "./ProficiencyAchievementFloater";



const WALK_SPEED = 3.2;

const RUN_SPEED = 6.4;

const TURN_SHARPNESS = 12;

const AVATAR_SCALE = 1.38;

const FOOT_OFFSET = 1.05 * AVATAR_SCALE;

const UP = new THREE.Vector3(0, 1, 0);



function shortestAngle(from: number, to: number) {

  return Math.atan2(Math.sin(to - from), Math.cos(to - from));

}



export function PlayerAvatar() {

  const root = useRef<THREE.Group>(null);

  const teleportFx = useRef<THREE.Group>(null);

  const forward = useRef(new THREE.Vector3());

  const right = useRef(new THREE.Vector3());

  const moveDir = useRef(new THREE.Vector3());

  const heading = useRef(Math.PI);

  const syncStoreAt = useRef(0);

  const surfaceY = useRef(0);



  const teleportTick = useWorldStore((s) => s.teleportTick);

  const { camera } = useThree();



  useEffect(() => {

    const [x, , z] = useWorldStore.getState().playerPosition;

    setIslandPosition(x, z);

    const sy = getSurfaceHeight(x, z);

    surfaceY.current = sy;

    root.current?.position.set(x, avatarRootY(sy, FOOT_OFFSET), z);

    useWorldStore.getState().updateProximity(x, z);

  }, [teleportTick]);



  useFrame((_, dt) => {

    const group = root.current;

    const mesh = teleportFx.current;

    if (!group || !mesh) return;



    const store = useWorldStore.getState();

    const setGait = (moving: boolean, running: boolean) => {

      if (store.isMoving !== moving) store.setIsMoving(moving);

      if (store.isRunning !== running) store.setIsRunning(running);

    };



    const phase = store.teleportPhase;

    if (phase !== "idle") {

      const s = phase === "blink-out" ? mesh.scale.x - 0.08 : mesh.scale.x + 0.08;

      mesh.scale.setScalar(THREE.MathUtils.clamp(s, 0.01, 1));

      mesh.visible = mesh.scale.x > 0.05;

      group.position.set(

        islandRuntime.posX,

        avatarRootY(surfaceY.current, FOOT_OFFSET),

        islandRuntime.posZ,

      );

      setGait(false, false);

      return;

    }

    mesh.scale.setScalar(1);

    mesh.visible = true;



    camera.getWorldDirection(forward.current);

    forward.current.y = 0;

    if (forward.current.lengthSq() < 1e-6) forward.current.set(0, 0, -1);

    forward.current.normalize();

    right.current.crossVectors(forward.current, UP).normalize();



    let px = islandRuntime.posX;
    let pz = islandRuntime.posZ;

    const fruit = useFruitStore.getState();
    const interactTree =
      fruit.phase === "consuming" && fruit.activeTreeId ? getTreeById(fruit.activeTreeId) : null;

    moveDir.current.set(0, 0, 0);

    if (!islandRuntime.interactionLocked) {
      moveDir.current
        .addScaledVector(forward.current, Number(islandRuntime.forward) - Number(islandRuntime.back))
        .addScaledVector(right.current, Number(islandRuntime.right) - Number(islandRuntime.left));
    } else if (interactTree) {
      const dx = interactTree.x - px;
      const dz = interactTree.z - pz;
      const target = Math.atan2(dx, dz);
      heading.current += shortestAngle(heading.current, target) * (1 - Math.exp(-TURN_SHARPNESS * dt));
    }

    const moving = moveDir.current.lengthSq() > 0;
    const running = moving && islandRuntime.run;



    if (moving) {

      moveDir.current.normalize();

      const step = (running ? RUN_SPEED : WALK_SPEED) * dt;

      let nx = px + moveDir.current.x * step;

      let nz = pz + moveDir.current.z * step;

      [nx, nz] = resolveObstacleCollisions(nx, nz);

      [nx, nz, surfaceY.current] = resolveSurfaceMovement(px, pz, nx, nz);

      setIslandPosition(nx, nz);

      px = nx;

      pz = nz;



      const target = Math.atan2(moveDir.current.x, moveDir.current.z);

      heading.current += shortestAngle(heading.current, target) * (1 - Math.exp(-TURN_SHARPNESS * dt));

    } else {

      surfaceY.current = getSurfaceHeight(px, pz);

    }



    const p = fruit.consumeProgress;
    const reachLean =
      fruit.phase === "consuming"
        ? p < 0.38
          ? 0.12 + p * 0.55
          : 0.32 - (p - 0.38) * 0.25
        : 0;
    mesh.rotation.x = reachLean;
    mesh.rotation.y = heading.current;

    group.position.set(px, avatarRootY(surfaceY.current, FOOT_OFFSET), pz);

    setGait(moving, running);



    const now = performance.now();

    if (now - syncStoreAt.current > 60) {

      syncStoreAt.current = now;

      store.setPlayerPosition([px, surfaceY.current, pz]);

      store.updateProximity(px, pz);

    }

  });



  return (

    <group ref={root}>
      <group scale={AVATAR_SCALE}>
        <group ref={teleportFx}>
          <Suspense fallback={null}>
            <HumanoidAvatar />
          </Suspense>
        </group>
        <ProficiencyAchievementFloater />
      </group>
    </group>

  );

}

