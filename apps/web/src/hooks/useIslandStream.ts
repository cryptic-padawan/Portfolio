"use client";

import { useDeviceTier } from "@/components/providers/DeviceTierProvider";
import { inStreamRange, spokeInStream, streamRadiusForTier } from "@/lib/islandStreaming";
import { useWorldStore } from "@/store/worldStore";

export function useIslandStream() {
  const pos = useWorldStore((s) => s.playerPosition);
  const { tier } = useDeviceTier();
  const radius = streamRadiusForTier(tier);
  const cx = pos[0];
  const cz = pos[2];
  const bucketX = Math.floor(cx / 10);
  const bucketZ = Math.floor(cz / 10);
  const grassBucket = `${bucketX},${bucketZ}`;

  const inRange = (x: number, z: number, extra = 0) =>
    inStreamRange(x, z, cx, cz, radius + extra);

  const spokeVisible = (poiX: number, poiZ: number) => spokeInStream(poiX, poiZ, cx, cz, radius);

  return { cx, cz, radius, grassBucket, inRange, spokeVisible };
}
