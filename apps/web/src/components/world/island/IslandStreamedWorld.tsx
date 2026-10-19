"use client";

import { useDeviceTier } from "@/components/providers/DeviceTierProvider";
import { useIslandStream } from "@/hooks/useIslandStream";
import { WORLD_POIS } from "@/lib/worldPois";
import { CobblestoneHub } from "./CobblestoneHub";
import { CobblestoneSpoke } from "./CobblestoneSpoke";
import { InteractiveGrassField } from "./InteractiveGrassField";
import { IslandRocks } from "./IslandRocks";
import { IslandTorches } from "./IslandTorches";
import { IslandTrees } from "./IslandTrees";
import { PoiAltar } from "./PoiAltar";

const POI_PATH_SEEDS: Record<string, number> = {
  "spire-gate": 101,
  "chronicle-hall": 202,
  "sending-stone": 303,
  "cozy-hearth": 404,
  "neon-arcade": 505,
  "orbital-dock": 606,
};

export function IslandStreamedWorld() {
  const { tier } = useDeviceTier();
  const { inRange, spokeVisible } = useIslandStream();
  const stoneDensity = tier <= 1 ? 0.72 : tier === 2 ? 0.88 : 1;
  const hubVisible = inRange(0, 0, 3);

  return (
    <>
      {hubVisible && <CobblestoneHub stoneDensity={stoneDensity} />}
      {WORLD_POIS.map((poi) =>
        spokeVisible(poi.world[0], poi.world[2]) ? (
          <CobblestoneSpoke
            key={`spoke-${poi.id}`}
            target={[poi.world[0], poi.world[2]]}
            seed={POI_PATH_SEEDS[poi.id] ?? poi.id.length * 17}
            stoneDensity={stoneDensity}
          />
        ) : null,
      )}
      {WORLD_POIS.map((poi) =>
        inRange(poi.world[0], poi.world[2], 5) ? (
          <PoiAltar
            key={`altar-${poi.id}`}
            x={poi.world[0]}
            z={poi.world[2]}
            seed={POI_PATH_SEEDS[poi.id] ?? poi.id.length * 17}
            stoneDensity={stoneDensity}
          />
        ) : null,
      )}
      <InteractiveGrassField />
      <IslandTrees />
      <IslandRocks />
      <IslandTorches />
    </>
  );
}
