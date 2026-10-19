"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  HUB_RADIUS,
  PATH_HALF_WIDTH,
  POI_ALTAR_OUTER_RADIUS,
  pathUnitVector,
} from "@/lib/islandTerrain";
import { getStoneGeometries, layoutPackedPathStones, mulberry32 } from "./cobblestoneUtils";

type Props = {
  target: [number, number];
  seed: number;
  stoneDensity?: number;
};

export function CobblestoneSpoke({ target, seed, stoneDensity = 1 }: Props) {
  const [tx, tz] = target;
  const { ux, uz, len } = pathUnitVector(tx, tz);
  const perpX = -uz;
  const perpZ = ux;
  const stoneGeos = useMemo(() => getStoneGeometries(), []);

  const { bed, stones, quat, curbLeft, curbRight } = useMemo(() => {
    const rand = mulberry32(seed);
    const start = HUB_RADIUS + 0.12;
    const end = Math.max(start + 2, len - POI_ALTAR_OUTER_RADIUS + 0.35);
    const spokeLen = end - start;
    const midX = ux * (start + end) * 0.5;
    const midZ = uz * (start + end) * 0.5;

    const dir = new THREE.Vector3(ux, 0, uz).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);

    const bed = { midX, midZ, spokeLen };
    const edge = PATH_HALF_WIDTH + 0.06;
    const curbLeft = {
      x: midX + perpX * edge,
      z: midZ + perpZ * edge,
    };
    const curbRight = {
      x: midX - perpX * edge,
      z: midZ - perpZ * edge,
    };

    const half = PATH_HALF_WIDTH * 0.96;
    let packed = layoutPackedPathStones(
      rand,
      start,
      end,
      ux,
      uz,
      perpX,
      perpZ,
      0.11,
      seed,
      half,
    );
    if (stoneDensity < 1) {
      packed = packed.filter((_, i) => i % Math.ceil(1 / stoneDensity) === 0);
    }

    return { bed, stones: packed, quat, curbLeft, curbRight };
  }, [ux, uz, len, perpX, perpZ, seed, stoneDensity]);

  const curbMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#6b5a48", roughness: 0.94, flatShading: false }),
    [],
  );

  return (
    <group>
      <mesh
        receiveShadow
        castShadow
        position={[bed.midX, 0.06, bed.midZ]}
        quaternion={quat}
        renderOrder={2}
      >
        <boxGeometry args={[PATH_HALF_WIDTH * 2 + 0.55, 0.12, bed.spokeLen + 0.45]} />
        <meshStandardMaterial color="#7a6f5e" roughness={0.96} />
      </mesh>
      <mesh
        receiveShadow
        position={[curbLeft.x, 0.078, curbLeft.z]}
        quaternion={quat}
        material={curbMat}
      >
        <boxGeometry args={[0.11, 0.07, bed.spokeLen + 0.5]} />
      </mesh>
      <mesh
        receiveShadow
        position={[curbRight.x, 0.078, curbRight.z]}
        quaternion={quat}
        material={curbMat}
      >
        <boxGeometry args={[0.11, 0.07, bed.spokeLen + 0.5]} />
      </mesh>
      {stones.map((s, i) => (
        <mesh
          key={`stone-${seed}-${i}`}
          castShadow
          receiveShadow
          position={[s.x, s.y, s.z]}
          rotation={[s.tiltX, s.ry, s.tiltZ]}
          scale={s.scale}
          geometry={stoneGeos[s.geoIndex]}
        >
          <meshStandardMaterial color={s.color} roughness={0.9} metalness={0.02} flatShading />
        </mesh>
      ))}
    </group>
  );
}
