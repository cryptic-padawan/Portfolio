"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Outlines } from "@react-three/drei/core/Outlines";
import * as THREE from "three";
import { getTreeFruitPositions, getTreeLayout, treeRand } from "@/lib/treeLayout";

type Props = {
  position: [number, number, number];
  seed?: number;
  scale?: number;
  highlightFruit?: boolean;
  showFruit?: boolean;
};

function foliageCluster(seed: number) {
  const greens = ["#2d6b3a", "#3a8048", "#4a9456", "#5aa864"];
  const blobs: { pos: [number, number, number]; r: number; color: string }[] = [];
  for (let i = 0; i < 10; i++) {
    const a = treeRand(seed, i) * Math.PI * 2;
    const h = 0.65 + treeRand(seed, i + 3) * 2.15;
    const rad = 0.45 + treeRand(seed, i + 7) * 0.85;
    blobs.push({
      pos: [Math.cos(a) * rad * 0.7, h, Math.sin(a) * rad * 0.7],
      r: 0.62 + treeRand(seed, i + 11) * 0.5,
      color: greens[i % greens.length]!,
    });
  }
  return blobs.map((b, i) => (
    <mesh key={i} castShadow position={b.pos}>
      <icosahedronGeometry args={[b.r, 1]} />
      <meshStandardMaterial color={b.color} roughness={0.82} flatShading />
    </mesh>
  ));
}

function barkRidges(seed: number, trunkH: number) {
  const mats = ["#4a3224", "#3d2a1c", "#52372a"];
  const ridges = [];
  for (let i = 0; i < 7; i++) {
    const y = 0.35 + (i / 7) * trunkH * 0.82;
    const rot = treeRand(seed, i + 20) * Math.PI;
    ridges.push(
      <mesh key={`ridge-${i}`} castShadow position={[0, y, 0]} rotation={[0, rot, 0]}>
        <boxGeometry args={[0.52, 0.11, 0.14]} />
        <meshStandardMaterial color={mats[i % mats.length]!} roughness={0.98} />
      </mesh>,
    );
  }
  return ridges;
}

const branchMat = new THREE.MeshStandardMaterial({ color: "#3d2818", roughness: 0.95 });
const rootMat = new THREE.MeshStandardMaterial({ color: "#2a1c12", roughness: 1 });
const fruitMat = new THREE.MeshStandardMaterial({
  color: "#f0652a",
  emissive: "#c2410c",
  emissiveIntensity: 0.55,
  roughness: 0.4,
});

function branches(seed: number, trunkTopY: number) {
  const items = [];
  for (let i = 0; i < 4; i++) {
    const ang = treeRand(seed, 30 + i) * Math.PI * 2;
    const len = 0.75 + treeRand(seed, 40 + i) * 0.45;
    const tilt = 0.55 + treeRand(seed, 50 + i) * 0.35;
    items.push(
      <mesh
        key={`branch-${i}`}
        castShadow
        material={branchMat}
        position={[Math.cos(ang) * 0.12, trunkTopY - 0.35 - i * 0.08, Math.sin(ang) * 0.12]}
        rotation={[tilt, ang, 0.15]}
      >
        <cylinderGeometry args={[0.06, 0.1, len, 6]} />
      </mesh>,
    );
  }
  return items;
}

function roots(seed: number) {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2 + treeRand(seed, 60 + i);
    items.push(
      <mesh
        key={`root-${i}`}
        receiveShadow
        material={rootMat}
        position={[Math.cos(ang) * 0.28, -0.06, Math.sin(ang) * 0.28]}
        rotation={[0.85 + treeRand(seed, 70 + i) * 0.25, ang, 0]}
      >
        <boxGeometry args={[0.22, 0.1, 0.55 + treeRand(seed, 80 + i) * 0.35]} />
      </mesh>,
    );
  }
  return items;
}

export function RealmTree({
  position,
  seed = 0,
  scale = 1,
  highlightFruit = false,
  showFruit = false,
}: Props) {
  const canopy = useRef<THREE.Group>(null);
  const s = seed * 1.7;
  const layout = useMemo(() => getTreeLayout(seed, 1), [seed]);
  const fruitPositions = useMemo(() => getTreeFruitPositions(seed), [seed]);
  const { trunkHeight, trunkTopY, canopyBaseY } = layout;

  const bark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4a3224", roughness: 0.96 }), []);

  useFrame(({ clock }) => {
    const g = canopy.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.rotation.z = Math.sin(t * 0.9 + s) * 0.03;
    g.rotation.x = Math.sin(t * 0.7 + s * 0.4) * 0.018;
  });

  return (
    <group position={position} scale={scale}>
      {roots(seed)}
      <mesh castShadow position={[0, trunkHeight * 0.42, 0]} material={bark}>
        <cylinderGeometry args={[0.34, 0.48, trunkHeight * 0.95, 12]} />
      </mesh>
      {barkRidges(seed, trunkHeight)}
      {branches(seed, trunkTopY)}
      <group ref={canopy} position={[0, canopyBaseY, 0]}>
        {foliageCluster(seed)}
        {showFruit &&
          fruitPositions.map((fp, i) => (
            <mesh key={`fruit-${i}`} castShadow position={fp} material={fruitMat}>
              <sphereGeometry args={[0.11, 10, 10]} />
              {highlightFruit && (
                <Outlines thickness={0.05} color="#ffe566" screenspace angle={0.08} />
              )}
            </mesh>
          ))}
      </group>
    </group>
  );
}
