"use client";

export function PlaceholderZoneScene({ detail }: { detail: "full" | "haze" }) {
  const neon = detail === "full";
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial
        color={neon ? "#1a1030" : "#151820"}
        emissive={neon ? "#ff00aa" : "#000000"}
        emissiveIntensity={neon ? 0.15 : 0}
      />
    </mesh>
  );
}
