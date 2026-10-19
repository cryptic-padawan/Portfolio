"use client";

import { Stars } from "@react-three/drei/core/Stars";
import { Sky } from "@react-three/drei/core/Sky";
import { useDeviceTier } from "@/components/providers/DeviceTierProvider";
import { useNightStore } from "@/store/nightStore";

export function IslandNightLighting() {
  const visualNight = useNightStore((s) => s.visualNight);
  const sceneryNight = useNightStore((s) => s.sceneryNight);
  const atmosphereNight = useNightStore((s) => s.atmosphereNight);
  const { tier } = useDeviceTier();

  const dayBg = "#0a0e18";
  const nightBg = "#050810";
  const bg = visualNight ? nightBg : dayBg;

  const fogNear = atmosphereNight ? 8 : visualNight ? 5 : tier <= 1 ? 12 : 16;
  const fogFar = atmosphereNight ? 38 : visualNight ? 30 : tier >= 2 ? 52 : 42;
  const fogColor = visualNight ? "#0a1424" : "#7a9a72";

  const ambient = sceneryNight ? 0.11 : visualNight ? 0.28 : 0.45;
  const hemi = sceneryNight ? 0.12 : visualNight ? 0.22 : 0.48;
  const sun = sceneryNight ? 0.22 : visualNight ? 0.55 : 1.2;

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <ambientLight
        intensity={ambient}
        color={visualNight ? "#4a5878" : "#ffffff"}
      />
      <hemisphereLight
        intensity={hemi}
        color={visualNight ? "#6a7a99" : "#d8f0ff"}
        groundColor={visualNight ? "#1a2418" : "#5a8050"}
      />
      <directionalLight
        castShadow={tier >= 2 && !visualNight}
        intensity={sun}
        color={visualNight ? "#8ab4ff" : "#ffffff"}
        position={visualNight ? [-8, 14, 6] : [12, 20, 8]}
      />
      {tier >= 2 && !visualNight && (
        <Sky distance={450000} sunPosition={[100, 8, -120]} inclination={0.52} azimuth={0.22} />
      )}
      <Stars
        radius={120}
        depth={60}
        count={visualNight ? (tier <= 1 ? 1400 : 3200) : tier <= 1 ? 900 : 2400}
        factor={visualNight ? 4.5 : 3}
        fade
        saturation={visualNight ? 0.35 : 0}
      />
    </>
  );
}
