"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "@/store/worldStore";

export function TeleportFx() {
  const ring = useRef<THREE.Mesh>(null);
  const phase = useWorldStore((s) => s.teleportPhase);
  const pos = useWorldStore((s) => s.playerPosition);

  useFrame((_, dt) => {
    if (!ring.current) return;
    const active = phase !== "idle";
    ring.current.visible = active;
    if (!active) return;
    ring.current.position.set(pos[0], 0.15, pos[2]);
    const scale = phase === "blink-out" ? 1 + dt * 4 : 2 - dt * 3;
    ring.current.scale.setScalar(Math.max(0.2, scale));
    const mat = ring.current.material as THREE.MeshBasicMaterial;
    mat.opacity = phase === "blink-out" ? 0.85 : 0.35;
  });

  return (
    <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.5, 1.4, 32]} />
      <meshBasicMaterial color="#9ae8ff" transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}
