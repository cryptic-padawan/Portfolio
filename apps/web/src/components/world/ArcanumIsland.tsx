"use client";

import { ISLAND_DISC_RADIUS } from "@/lib/worldPois";
import { IslandStreamedWorld } from "./island/IslandStreamedWorld";

const R = ISLAND_DISC_RADIUS;

export function ArcanumIsland() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[R, 64]} />
        <meshStandardMaterial color="#3d6b3a" roughness={0.96} metalness={0} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[R * 0.92, 48]} />
        <meshStandardMaterial color="#457a42" roughness={0.94} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[R * 0.88, R, 64]} />
        <meshStandardMaterial color="#5a4a38" roughness={1} />
      </mesh>
      <IslandStreamedWorld />
    </group>
  );
}
