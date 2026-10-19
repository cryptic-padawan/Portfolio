"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { islandRuntime } from "@/lib/islandRuntime";
import { getSurfaceHeight } from "@/lib/islandSurfaces";

const LOOK_HEIGHT = 1.4;
const FOLLOW_SHARPNESS = 10;
const SNAP_DISTANCE = 4;

/** Third-person follow: the orbit pivot tracks the avatar and the camera is carried along by the same offset. */
export function CameraDirector({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const camera = useThree((s) => s.camera);
  const desired = useRef(new THREE.Vector3());
  const delta = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const groundY = getSurfaceHeight(islandRuntime.posX, islandRuntime.posZ);
    desired.current.set(islandRuntime.posX, groundY + LOOK_HEIGHT, islandRuntime.posZ);
    delta.current.subVectors(desired.current, controls.target);

    if (delta.current.length() < SNAP_DISTANCE) {
      delta.current.multiplyScalar(1 - Math.exp(-FOLLOW_SHARPNESS * dt));
    }

    controls.target.add(delta.current);
    camera.position.add(delta.current);
    controls.update();
  });

  return null;
}
