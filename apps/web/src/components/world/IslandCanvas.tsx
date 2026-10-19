"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { IslandNightLighting } from "./IslandNightLighting";
import { Suspense } from "react";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ArcanumIsland } from "./ArcanumIsland";
import { PoiLandmarks } from "./PoiLandmarks";
import { StreamRadiusSync } from "./StreamRadiusSync";
import { FruitProximitySystem } from "./FruitProximitySystem";
import { FruitTreeWorldPrompt } from "./FruitTreeWorldPrompt";
import { PlayerAvatar } from "./PlayerAvatar";
import { NightTransitionDriver } from "./NightTransitionDriver";
import { PlayerNavigatorLightAnchor } from "./PlayerNavigatorLight";
import { TeleportFx } from "./TeleportFx";
import { CameraDirector } from "./CameraDirector";
import { ISLAND_DISC_RADIUS, ISLAND_SPAWN } from "@/lib/worldPois";
import { useDeviceTier } from "@/components/providers/DeviceTierProvider";

export function IslandCanvas() {
  const { tier, prefersReducedMotion } = useDeviceTier();
  const dpr = tier <= 1 ? 1 : tier === 2 ? 1.25 : 1.5;
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div
      className="absolute inset-0 outline-none"
      tabIndex={0}
      role="application"
      aria-label="3D realm — click here then use WASD to move"
      onPointerDown={(e) => {
        (e.currentTarget as HTMLDivElement).focus();
      }}
    >
      <Canvas shadows={tier >= 2} dpr={[1, dpr]} gl={{ antialias: tier >= 2 }}>
        <NightTransitionDriver />
        <IslandNightLighting />
        <PerspectiveCamera makeDefault position={[0, 4.4, 17]} fov={50} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60}>
            <RigidBody type="fixed" position={[0, -0.5, 0]}>
              <CuboidCollider args={[ISLAND_DISC_RADIUS + 2, 0.25, ISLAND_DISC_RADIUS + 2]} />
            </RigidBody>
            <ArcanumIsland />
            <PoiLandmarks />
            <TeleportFx />
          </Physics>
          {!prefersReducedMotion && (
            <>
              <StreamRadiusSync />
              <FruitProximitySystem />
              <FruitTreeWorldPrompt />
              <PlayerAvatar />
              <PlayerNavigatorLightAnchor />
            </>
          )}
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          target={[ISLAND_SPAWN[0], 1.4, ISLAND_SPAWN[2]]}
          enablePan={false}
          enableDamping={false}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={3.5}
          maxDistance={22}
        />
        <CameraDirector controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}
