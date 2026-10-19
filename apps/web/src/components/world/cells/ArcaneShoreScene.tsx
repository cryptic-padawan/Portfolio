"use client";

import { Float } from "@react-three/drei/core/Float";
import { Sparkles } from "@react-three/drei/core/Sparkles";

export function ArcaneShoreScene({ detail }: { detail: "full" | "haze" }) {
  const low = detail === "haze";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!low}>
        <circleGeometry args={[18, 48]} />
        <meshStandardMaterial color={low ? "#2a3d52" : "#3a5f4a"} roughness={0.9} />
      </mesh>
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[22, 26, 4, 32]} />
        <meshStandardMaterial color="#1e2438" />
      </mesh>
      {!low && (
        <>
          <Float speed={1.2} floatIntensity={0.4}>
            <mesh position={[-6, 2.5, -4]}>
              <coneGeometry args={[1.2, 3.5, 6]} />
              <meshStandardMaterial color="#4a6741" />
            </mesh>
          </Float>
          <mesh position={[5, 1.2, 3]} castShadow>
            <boxGeometry args={[2.5, 2.5, 2.5]} />
            <meshStandardMaterial color="#5c4a32" />
          </mesh>
          <mesh position={[5, 2.8, 3]}>
            <coneGeometry args={[2, 2.5, 4]} />
            <meshStandardMaterial color="#3d2e22" />
          </mesh>
          <Sparkles count={40} scale={14} size={2} speed={0.3} color="#c9a227" />
        </>
      )}
      {low && (
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[4, 3, 4]} />
          <meshStandardMaterial color="#2d3548" wireframe />
        </mesh>
      )}
    </group>
  );
}
