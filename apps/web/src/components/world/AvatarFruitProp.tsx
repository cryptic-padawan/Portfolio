"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { findRightHandBone } from "@/lib/findHandBone";
import { fruitInHand, useFruitStore } from "@/store/fruitStore";

type Props = {
  model: THREE.Object3D;
};

export function AvatarFruitProp({ model }: Props) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const phase = useFruitStore((s) => s.phase);
  const progress = useFruitStore((s) => s.consumeProgress);

  useEffect(() => {
    const bone = findRightHandBone(model);
    if (!bone) return;

    const fruit = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 10, 10),
      new THREE.MeshStandardMaterial({
        color: "#e85d2c",
        emissive: "#6a2200",
        emissiveIntensity: 0.35,
        roughness: 0.45,
      }),
    );
    fruit.name = "knowledge-fruit-prop";
    fruit.castShadow = true;
    fruit.position.set(0.04, 0.02, 0.06);
    fruit.visible = false;
    bone.add(fruit);
    meshRef.current = fruit;

    return () => {
      bone.remove(fruit);
      fruit.geometry.dispose();
      (fruit.material as THREE.Material).dispose();
      meshRef.current = null;
    };
  }, [model]);

  useEffect(() => {
    const fruit = meshRef.current;
    if (!fruit) return;
    fruit.visible = fruitInHand(progress, phase);
  }, [phase, progress]);

  return null;
}
