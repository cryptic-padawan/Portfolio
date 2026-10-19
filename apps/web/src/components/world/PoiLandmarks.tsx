"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WORLD_POIS, type WorldPoi } from "@/lib/worldPois";
import { useWorldStore } from "@/store/worldStore";

const BEAM_HEIGHT = 17;
const ORB_FLOAT_Y = 1.05;

function PoiBeacon({ poi, active }: { poi: WorldPoi; active: boolean }) {
  const orb = useRef<THREE.Mesh>(null);
  const pulse = useRef(0);

  const beamGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.55, 0.22, BEAM_HEIGHT, 14, 8, true);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const base = new THREE.Color(poi.accent);
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = (y + BEAM_HEIGHT / 2) / BEAM_HEIGHT;
      const fade = Math.pow(1 - t, 1.65);
      colors[i * 3] = base.r * fade;
      colors[i * 3 + 1] = base.g * fade;
      colors[i * 3 + 2] = base.b * fade;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [poi.accent]);

  const beamMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        emissive: poi.accent,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [poi.accent],
  );

  useFrame(({ clock }, dt) => {
    pulse.current += dt * 2.2;
    const bob = Math.sin(clock.elapsedTime * 1.8) * 0.06;
    if (orb.current) {
      orb.current.position.y = ORB_FLOAT_Y + bob;
      orb.current.rotation.y += dt * 1.1;
    }
    beamMat.emissiveIntensity = active ? 0.55 : 0.28 + Math.sin(pulse.current) * 0.12;
  });

  const [x, , z] = poi.world;
  const color = poi.accent;
  const beamBaseY = ORB_FLOAT_Y + BEAM_HEIGHT / 2;

  return (
    <group position={[x, 0, z]}>
      <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.42, 0.52, 0.52, 12]} />
        <meshStandardMaterial color="#8a8278" roughness={0.9} />
      </mesh>
      <mesh ref={orb} position={[0, ORB_FLOAT_Y, 0]}>
        <sphereGeometry args={[0.38, 20, 20]} />
        <meshStandardMaterial
          color="#f8ffff"
          emissive={color}
          emissiveIntensity={active ? 1.6 : 1.1}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, beamBaseY, 0]} geometry={beamGeo} material={beamMat} />
      <pointLight position={[0, ORB_FLOAT_Y, 0]} intensity={active ? 2.8 : 1.6} color={color} distance={20} />
    </group>
  );
}

export function PoiLandmarks() {
  const activePoiId = useWorldStore((s) => s.activePoiId);
  const nearbyPoiId = useWorldStore((s) => s.nearbyPoiId);

  return (
    <group>
      {WORLD_POIS.map((poi) => (
        <PoiBeacon
          key={poi.id}
          poi={poi}
          active={poi.id === activePoiId || poi.id === nearbyPoiId}
        />
      ))}
    </group>
  );
}
