"use client";

import { ISLAND_TREES } from "@/lib/islandForest";
import { useIslandStream } from "@/hooks/useIslandStream";
import { FRUIT_PLUCK_AT, useFruitStore } from "@/store/fruitStore";
import { RealmTree } from "./RealmTree";

export function IslandTrees() {
  const { inRange } = useIslandStream();
  const nearbyTreeId = useFruitStore((s) => s.nearbyTreeId);
  const activeTreeId = useFruitStore((s) => s.activeTreeId);
  const phase = useFruitStore((s) => s.phase);
  const consumeProgress = useFruitStore((s) => s.consumeProgress);
  const eatenTreeIds = useFruitStore((s) => s.eatenTreeIds);

  return (
    <>
      {ISLAND_TREES.filter((t) => inRange(t.x, t.z)).map((t) => {
        const pluckedFromTree =
          t.id === activeTreeId && phase === "consuming" && consumeProgress >= FRUIT_PLUCK_AT;
        const showFruit = t.hasFruit && !eatenTreeIds.includes(t.id) && !pluckedFromTree;
        const highlightFruit = showFruit && (t.id === nearbyTreeId || t.id === activeTreeId);

        return (
          <RealmTree
            key={t.id}
            position={[t.x, 0, t.z]}
            seed={t.seed}
            scale={t.scale}
            highlightFruit={highlightFruit}
            showFruit={showFruit}
          />
        );
      })}
    </>
  );
}
