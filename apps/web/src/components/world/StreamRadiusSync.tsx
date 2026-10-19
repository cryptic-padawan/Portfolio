"use client";

import { useFrame } from "@react-three/fiber";
import { useDeviceTier } from "@/components/providers/DeviceTierProvider";
import { islandRuntime } from "@/lib/islandRuntime";
import { streamRadiusForTier } from "@/lib/islandStreaming";

export function StreamRadiusSync() {
  const { tier } = useDeviceTier();
  useFrame(() => {
    islandRuntime.streamRadius = streamRadiusForTier(tier);
  });
  return null;
}
