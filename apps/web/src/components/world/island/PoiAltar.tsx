"use client";

import { useMemo } from "react";
import {
  getStoneGeometries,
  layoutPackedAnnulusStones,
  layoutPackedDiscStones,
  mulberry32,
} from "./cobblestoneUtils";
import { POI_ALTAR_OUTER_RADIUS } from "@/lib/islandTerrain";

const STEPS = [
  { r: POI_ALTAR_OUTER_RADIUS, y: 0.06, h: 0.11 },
  { r: POI_ALTAR_OUTER_RADIUS * 0.72, y: 0.16, h: 0.1 },
  { r: POI_ALTAR_OUTER_RADIUS * 0.48, y: 0.25, h: 0.09 },
];

type Props = {
  x: number;
  z: number;
  seed: number;
  stoneDensity?: number;
};

export function PoiAltar({ x, z, seed, stoneDensity = 1 }: Props) {
  const stoneGeos = useMemo(() => getStoneGeometries(), []);

  const { deckStones, tierStones } = useMemo(() => {
    const rand = mulberry32(seed + 500);
    let deck = layoutPackedDiscStones(
      rand,
      POI_ALTAR_OUTER_RADIUS * 0.46,
      0.32,
      seed,
      POI_ALTAR_OUTER_RADIUS * 0.12,
    );
    let tier = layoutPackedAnnulusStones(
      rand,
      POI_ALTAR_OUTER_RADIUS * 0.72,
      POI_ALTAR_OUTER_RADIUS + 0.05,
      0.155,
      seed + 1,
    );
    if (stoneDensity < 1) {
      const skip = Math.ceil(1 / stoneDensity);
      deck = deck.filter((_, i) => i % skip === 0);
      tier = tier.filter((_, i) => i % skip === 0);
    }
    return { deckStones: deck, tierStones: tier };
  }, [seed, stoneDensity]);

  return (
    <group position={[x, 0, z]}>
      {STEPS.map((step, i) => (
        <mesh key={`step-${i}`} receiveShadow castShadow position={[0, step.y, 0]}>
          <cylinderGeometry args={[step.r, step.r + 0.08, step.h, 32]} />
          <meshStandardMaterial color={i === 0 ? "#6f6456" : "#7a7064"} roughness={0.94} />
        </mesh>
      ))}
      <mesh receiveShadow position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <circleGeometry args={[POI_ALTAR_OUTER_RADIUS * 0.46, 28]} />
        <meshStandardMaterial color="#8a7f72" roughness={0.92} />
      </mesh>
      {tierStones.map((s, i) => (
        <mesh
          key={`altar-tier-${i}`}
          castShadow
          receiveShadow
          position={[s.x, s.y, s.z]}
          rotation={[s.tiltX, s.ry, s.tiltZ]}
          scale={s.scale}
          geometry={stoneGeos[s.geoIndex]}
        >
          <meshStandardMaterial color={s.color} roughness={0.9} flatShading />
        </mesh>
      ))}
      {deckStones.map((s, i) => (
        <mesh
          key={`altar-stone-${i}`}
          castShadow
          receiveShadow
          position={[s.x, s.y, s.z]}
          rotation={[s.tiltX, s.ry, s.tiltZ]}
          scale={s.scale}
          geometry={stoneGeos[s.geoIndex]}
        >
          <meshStandardMaterial color={s.color} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}
