"use client";

import { ISLAND_ROCKS } from "@/lib/islandForest";
import { useIslandStream } from "@/hooks/useIslandStream";

export function IslandRocks() {
  const { inRange } = useIslandStream();

  return (
    <>
      {ISLAND_ROCKS.filter((r) => inRange(r.x, r.z)).map((r, i) => (
        <group key={`rock-${r.x}-${r.z}-${i}`} position={[r.x, 0.25, r.z]} rotation={[0, r.rot, 0]}>
          <mesh castShadow receiveShadow scale={r.s}>
            <dodecahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial color="#6b6560" roughness={0.98} />
          </mesh>
        </group>
      ))}
    </>
  );
}
