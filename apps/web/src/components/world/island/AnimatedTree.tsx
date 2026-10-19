"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  seed?: number;
  scale?: number;
};

export function AnimatedTree({ position, seed = 0, scale = 1 }: Props) {
  const foliage = useRef<THREE.Group>(null);
  const s = seed * 1.7;

  useFrame(({ clock }) => {
    const g = foliage.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.rotation.z = Math.sin(t * 1.1 + s) * 0.045;
    g.rotation.x = Math.sin(t * 0.85 + s * 0.5) * 0.025;
  });

  const trunkH = 2.1 * scale;
  const layer = (y: number, r: number, h: number, color: string) => (
    <mesh castShadow position={[0, y, 0]}>
      <coneGeometry args={[r, h, 8]} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  );

  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, trunkH * 0.45, 0]}>
        <cylinderGeometry args={[0.22 * scale, 0.32 * scale, trunkH, 7]} />
        <meshStandardMaterial color="#5c4030" roughness={0.95} />
      </mesh>
      <group ref={foliage} position={[0, trunkH * 0.55, 0]}>
        {layer(0.9, 1.35, 2.2, "#2f5c38")}
        {layer(2.1, 1.05, 1.85, "#3a7044")}
        {layer(3.15, 0.75, 1.45, "#4a8556")}
      </group>
    </group>
  );
}
