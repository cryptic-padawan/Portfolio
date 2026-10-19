"use client";

import { memo } from "react";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  yaw: number;
};

const wood = new THREE.MeshStandardMaterial({ color: "#4a3219", roughness: 0.94 });
const iron = new THREE.MeshStandardMaterial({ color: "#2a2520", roughness: 0.85, metalness: 0.35 });
const flameMat = new THREE.MeshStandardMaterial({
  color: "#ff9a3c",
  emissive: "#ff5500",
  emissiveIntensity: 1.35,
  transparent: true,
  opacity: 0.92,
});

/** Static lit torch — no flame tick; visibility = mount/unmount only. */
function TorchStandInner({ position, yaw }: Props) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh castShadow material={wood} position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.9, 8]} />
      </mesh>
      <mesh castShadow material={wood} position={[0, 0.92, 0]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.08, 0.14, 0.08]} />
      </mesh>
      <mesh castShadow material={iron} position={[0.06, 1.02, 0]}>
        <boxGeometry args={[0.05, 0.08, 0.05]} />
      </mesh>
      <mesh castShadow material={wood} position={[0, 1.08, 0]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.035, 0.22, 6]} />
      </mesh>
      <group position={[0, 1.13, 0]}>
        <mesh castShadow material={flameMat} scale={[0.9, 1.15, 0.9]}>
          <coneGeometry args={[0.09, 0.35, 8]} />
        </mesh>
        <pointLight color="#ffb060" intensity={5} distance={17} decay={2} />
      </group>
    </group>
  );
}

export const TorchStand = memo(TorchStandInner);
