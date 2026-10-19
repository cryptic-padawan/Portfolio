"use client";

export function CozyHearthScene({ detail }: { detail: "full" | "haze" }) {
  const low = detail === "haze";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={low ? "#3a2f28" : "#4a3728"} />
      </mesh>
      {!low && (
        <>
          <mesh position={[0, 1.5, -3]}>
            <boxGeometry args={[8, 3, 0.3]} />
            <meshStandardMaterial color="#5c4030" />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[3, 0.2, 2]} />
            <meshStandardMaterial color="#6b4f3a" />
          </mesh>
          <pointLight position={[0, 1.5, 0]} color="#ffb86b" intensity={1.2} distance={8} />
        </>
      )}
    </group>
  );
}
