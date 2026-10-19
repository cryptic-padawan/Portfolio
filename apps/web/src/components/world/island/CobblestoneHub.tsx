"use client";

import { useMemo } from "react";
import {
  getStoneGeometries,
  layoutPackedAnnulusStones,
  layoutPackedDiscStones,
  mulberry32,
} from "./cobblestoneUtils";
import { HUB_INNER_STONE_RADIUS, HUB_RING_INNER, HUB_RING_OUTER } from "@/lib/islandSurfaces";

type Props = { stoneDensity?: number };

export function CobblestoneHub({ stoneDensity = 1 }: Props) {
  const stoneGeos = useMemo(() => getStoneGeometries(), []);

  const deckStones = useMemo(() => {
    const rand = mulberry32(9001);
    let stones = layoutPackedDiscStones(rand, HUB_INNER_STONE_RADIUS, 0.14, 77, 0.15);
    if (stoneDensity < 1) {
      stones = stones.filter((_, i) => i % Math.ceil(1 / stoneDensity) === 0);
    }
    return stones;
  }, [stoneDensity]);

  const ringStones = useMemo(() => {
    const rand = mulberry32(9002);
    let stones = layoutPackedAnnulusStones(rand, HUB_RING_INNER, HUB_RING_OUTER, 0.135, 88);
    if (stoneDensity < 1) {
      stones = stones.filter((_, i) => i % Math.ceil(1 / stoneDensity) === 0);
    }
    return stones;
  }, [stoneDensity]);

  return (
    <group>
      <mesh receiveShadow castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[HUB_RING_OUTER, HUB_RING_OUTER + 0.35, 0.14, 48]} />
        <meshStandardMaterial color="#6f6456" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <ringGeometry args={[HUB_RING_INNER, HUB_RING_OUTER + 0.05, 48]} />
        <meshStandardMaterial color="#8a7f72" roughness={0.93} />
      </mesh>
      <mesh receiveShadow position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <circleGeometry args={[HUB_INNER_STONE_RADIUS, 48]} />
        <meshStandardMaterial color="#8a7f72" roughness={0.93} />
      </mesh>
      {deckStones.map((s, i) => (
        <mesh
          key={`hub-deck-${i}`}
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
      {ringStones.map((s, i) => (
        <mesh
          key={`hub-ring-${i}`}
          castShadow
          receiveShadow
          position={[s.x, s.y, s.z]}
          rotation={[s.tiltX, s.ry, s.tiltZ]}
          scale={s.scale}
          geometry={stoneGeos[s.geoIndex]}
        >
          <meshStandardMaterial color={s.color} roughness={0.92} flatShading />
        </mesh>
      ))}
    </group>
  );
}
