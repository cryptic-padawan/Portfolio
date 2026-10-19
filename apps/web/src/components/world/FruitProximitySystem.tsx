"use client";

import { useFrame } from "@react-three/fiber";
import { FRUIT_TREES, getTreeById } from "@/lib/islandForest";
import { islandRuntime } from "@/lib/islandRuntime";
import { useFruitStore } from "@/store/fruitStore";

const INTERACT_RADIUS = 3.1;

/** Keeps nearby-tree detection in the 3D loop (no world-space UI). */
export function FruitProximitySystem() {
  const phase = useFruitStore((s) => s.phase);
  const activeTreeId = useFruitStore((s) => s.activeTreeId);
  const setNearbyTreeId = useFruitStore((s) => s.setNearbyTreeId);
  const tickConsume = useFruitStore((s) => s.tickConsume);
  const cancelInteraction = useFruitStore((s) => s.cancelInteraction);

  useFrame((_, dt) => {
    const consuming = phase === "consuming";
    islandRuntime.interactionLocked = consuming;

    if (consuming) tickConsume(dt);

    const px = islandRuntime.posX;
    const pz = islandRuntime.posZ;

    let nearest: string | null = null;
    let nearestD = INTERACT_RADIUS;
    for (const t of FRUIT_TREES) {
      const d = Math.hypot(t.x - px, t.z - pz);
      if (d < nearestD) {
        nearestD = d;
        nearest = t.id;
      }
    }

    if (!consuming) {
      setNearbyTreeId(nearest);
    } else if (activeTreeId) {
      const tree = getTreeById(activeTreeId);
      if (tree) {
        const d = Math.hypot(tree.x - px, tree.z - pz);
        if (d > INTERACT_RADIUS + 1.2) cancelInteraction();
      }
    }
  });

  return null;
}
