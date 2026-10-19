"use client";

import { useMemo } from "react";
import { useIslandStream } from "@/hooks/useIslandStream";
import { ISLAND_TORCHES } from "@/lib/torchLayout";
import { useNightStore } from "@/store/nightStore";
import { TorchStand } from "./TorchStand";

/** Night torches: always lit when mounted; cull by stream radius only (fog hides the rest). */
export function IslandTorches() {
  const torchesActive = useNightStore((s) => s.torchesActive);
  const { inRange, grassBucket } = useIslandStream();

  const torches = useMemo(
    () => ISLAND_TORCHES.filter((t) => inRange(t.x, t.z, 0)),
    [inRange, grassBucket],
  );

  if (!torchesActive) return null;

  return (
    <>
      {torches.map((t) => (
        <TorchStand key={t.id} position={[t.x, 0, t.z]} yaw={t.yaw} />
      ))}
    </>
  );
}
