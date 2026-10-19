"use client";



import { useFrame } from "@react-three/fiber";

import { useEffect, useMemo, useRef } from "react";

import * as THREE from "three";

import { useNightStore } from "@/store/nightStore";

import { useWorldStore } from "@/store/worldStore";

import { FairySparkles } from "./FairySparkles";



/** Ground-anchored column (group origin = walkable surface Y). */

const BEAM_BOTTOM = -0.06;

const BEAM_TOP = 9.2;

const BEAM_HEIGHT = BEAM_TOP - BEAM_BOTTOM;

const BEAM_Y = BEAM_BOTTOM + BEAM_HEIGHT * 0.5;



const BEAM_OUTER: [number, number] = [1.18, 1.34];



const ANCHOR_SMOOTH = 5.5;



const FAIRY_LIGHT_COUNT = 5;



type FairySeed = {

  phase: number;

  radius: number;

  yBase: number;

  speed: number;

  intensity: number;

  color: string;

};



function FairyDustLights() {

  const lights = useRef<(THREE.PointLight | null)[]>([]);



  const seeds = useMemo(

    (): FairySeed[] =>

      Array.from({ length: FAIRY_LIGHT_COUNT }, (_, i) => ({

        phase: i * 2.17,

        radius: 0.48 + (i % 5) * 0.16,

        yBase: 0.4 + (i / FAIRY_LIGHT_COUNT) * (BEAM_TOP - 0.35),

        speed: 0.18 + (i % 4) * 0.05,

        intensity: 1.15 + (i % 3) * 0.45,

        color: i % 3 === 0 ? "#fff0d4" : i % 3 === 1 ? "#ffffff" : "#dceeff",

      })),

    [],

  );



  useFrame((state) => {

    const t = state.clock.elapsedTime;

    seeds.forEach((s, i) => {

      const light = lights.current[i];

      if (!light) return;

      const ang = t * s.speed + s.phase;

      light.position.set(

        Math.cos(ang) * s.radius,

        s.yBase + Math.sin(t * s.speed * 0.85 + s.phase) * 0.38,

        Math.sin(ang) * s.radius,

      );

    });

  });



  return (

    <>

      {seeds.map((s, i) => (

        <pointLight

          key={i}

          ref={(el) => {

            lights.current[i] = el;

          }}

          intensity={s.intensity}

          distance={4.2}

          decay={2}

          color={s.color}

        />

      ))}

    </>

  );

}



function NavigatorColumnVisuals() {

  const beamHaloMat = useMemo(

    () =>

      new THREE.MeshBasicMaterial({

        color: "#c8d9f5",

        transparent: true,

        opacity: 0.032,

        depthWrite: false,

        side: THREE.DoubleSide,

        blending: THREE.AdditiveBlending,

      }),

    [],

  );



  const sparkleCenterY = BEAM_TOP * 0.48;



  return (

    <>

      <mesh position={[0, BEAM_Y, 0]} renderOrder={-2} raycast={() => null}>

        <cylinderGeometry args={[BEAM_OUTER[0], BEAM_OUTER[1], BEAM_HEIGHT, 36, 1, true]} />

        <primitive object={beamHaloMat} attach="material" />

      </mesh>



      <FairyDustLights />



      <group position={[0, sparkleCenterY, 0]}>

        <FairySparkles
          count={16}
          scale={[2.15, BEAM_TOP * 0.94, 2.15]}
          size={8.5}
          speed={0.2}
          opacity={1}
          color="#fff8e8"
        />
        <FairySparkles
          count={10}
          scale={[1.85, BEAM_TOP * 0.98, 1.85]}
          size={9}
          speed={0.14}
          opacity={1}
          color="#ffffff"
        />
        <FairySparkles
          count={6}
          scale={[2.45, BEAM_TOP * 0.88, 2.45]}
          size={8.25}
          speed={0.1}
          opacity={1}
          color="#cce8ff"
        />

      </group>

    </>

  );

}



/**

 * Night navigator anchored to terrain (not avatar root). Smooth follow avoids motion shimmer.

 */

export function PlayerNavigatorLightAnchor() {

  const navigatorOn = useNightStore((s) => s.atmosphereNight);

  const teleportTick = useWorldStore((s) => s.teleportTick);

  const anchorRef = useRef<THREE.Group>(null);

  const smooth = useRef(new THREE.Vector3());

  const initialized = useRef(false);

  useEffect(() => {
    const [tx, sy, tz] = useWorldStore.getState().playerPosition;
    smooth.current.set(tx, sy, tz);
    initialized.current = true;
  }, [teleportTick]);

  useFrame((_, dt) => {

    if (!navigatorOn) return;

    const [tx, sy, tz] = useWorldStore.getState().playerPosition;

    if (!initialized.current) {

      smooth.current.set(tx, sy, tz);

      initialized.current = true;

    } else {

      const k = 1 - Math.exp(-ANCHOR_SMOOTH * dt);

      smooth.current.set(

        THREE.MathUtils.lerp(smooth.current.x, tx, k),

        THREE.MathUtils.lerp(smooth.current.y, sy, k),

        THREE.MathUtils.lerp(smooth.current.z, tz, k),

      );

    }

    anchorRef.current?.position.copy(smooth.current);

  });



  if (!navigatorOn) return null;



  return (

    <group ref={anchorRef}>

      <NavigatorColumnVisuals />

    </group>

  );

}

