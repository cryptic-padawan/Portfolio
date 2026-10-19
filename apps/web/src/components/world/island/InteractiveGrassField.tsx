"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useDeviceTier } from "@/components/providers/DeviceTierProvider";
import { useIslandStream } from "@/hooks/useIslandStream";
import { islandRuntime } from "@/lib/islandRuntime";
import { inStreamRange } from "@/lib/islandStreaming";
import { clearanceFromPavement } from "@/lib/islandTerrain";
import { ISLAND_DISC_RADIUS } from "@/lib/worldPois";
import { mulberry32 } from "./cobblestoneUtils";

const BLADE_GEO = new THREE.PlaneGeometry(0.04, 0.42);
const BLADE_MAT = new THREE.MeshBasicMaterial({
  color: "#ffffff",
  side: THREE.DoubleSide,
  toneMapped: false,
  vertexColors: true,
});

type BladeData = {
  x: number;
  z: number;
  phase: number;
  height: number;
  yaw: number;
  color: THREE.Color;
};

const GRASS_TONES = ["#d4f5c8", "#e8fce0", "#c6efba", "#dff9d2", "#bce8ae", "#f0ffe8"];

const DETAIL_NEAR = 18;
const DETAIL_MID = 28;
const DETAIL_FAR = 38;

export function InteractiveGrassField() {
  const { tier } = useDeviceTier();
  const { cx, cz, radius, grassBucket } = useIslandStream();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { camera } = useThree();

  const allBlades = useMemo(() => {
    const out: BladeData[] = [];
    const r = ISLAND_DISC_RADIUS - 1.2;
    const target = tier <= 1 ? 2200 : tier === 2 ? 3800 : 5200;
    const rand = mulberry32(9191);
    const clusterOffsets = [
      [0, 0],
      [0.08, 0.04],
      [-0.05, 0.09],
      [0.04, -0.07],
      [-0.07, -0.04],
    ];
    const clusterCount = tier <= 1 ? 3 : tier === 2 ? 4 : 5;

    let attempts = 0;
    while (out.length < target && attempts < target * 4) {
      attempts++;
      const px = (rand() * 2 - 1) * r;
      const pz = (rand() * 2 - 1) * r;
      if (px * px + pz * pz > r * r) continue;

      const clearance = clearanceFromPavement(px, pz);
      if (clearance < 0.04) continue;
      if (clearance < 0.55 && rand() > 0.35 + clearance * 0.5) continue;

      for (let c = 0; c < clusterCount; c++) {
        const [ox, oz] = clusterOffsets[c]!;
        const jx = px + ox + (rand() - 0.5) * 0.12;
        const jz = pz + oz + (rand() - 0.5) * 0.12;
        if (jx * jx + jz * jz > r * r) continue;
        if (clearanceFromPavement(jx, jz) < 0.03) continue;

        const tone = GRASS_TONES[(Math.abs((jx * 3 + jz * 5 + c) | 0) % GRASS_TONES.length)]!;
        out.push({
          x: jx,
          z: jz,
          phase: (jx * 0.31 + jz * 0.47 + c) % (Math.PI * 2),
          height: 0.75 + rand() * 0.5,
          yaw: rand() * Math.PI * 2,
          color: new THREE.Color(tone),
        });
      }
    }
    return out;
  }, [tier]);

  const blades = useMemo(
    () => allBlades.filter((b) => inStreamRange(b.x, b.z, cx, cz, radius + 3)),
    [allBlades, radius, grassBucket, cx, cz],
  );

  useLayoutEffect(() => {
    const inst = mesh.current;
    if (!inst) return;
    blades.forEach((b, i) => {
      dummy.position.set(b.x, 0.18 * b.height, b.z);
      dummy.rotation.set(-0.25, b.yaw, 0);
      dummy.scale.set(1, b.height, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      inst.setColorAt(i, b.color);
    });
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  }, [blades, dummy]);

  const frameSkip = useRef(0);

  useFrame(({ clock }) => {
    const inst = mesh.current;
    if (!inst) return;

    frameSkip.current += 1;
    if (tier <= 2 && frameSkip.current % 2 !== 0) return;

    const t = clock.elapsedTime;
    const px = islandRuntime.posX;
    const pz = islandRuntime.posZ;
    const camX = camera.position.x;
    const camZ = camera.position.z;
    let dirty = false;

    for (let i = 0; i < blades.length; i++) {
      const b = blades[i]!;
      const distPlayer = Math.hypot(b.x - px, b.z - pz);
      const distCam = Math.hypot(b.x - camX, b.z - camZ);
      const focus = Math.min(distPlayer, distCam * 0.9);

      if (focus > DETAIL_FAR) continue;

      let lodScale = 1;
      if (focus > DETAIL_MID) lodScale = 0.28;
      else if (focus > DETAIL_NEAR) lodScale = 0.62;

      let tiltX = -0.22;
      let tiltZ = 0;
      if (distPlayer < 12) {
        tiltX += Math.sin(t * 2.1 + b.phase) * 0.08;
        tiltZ = Math.cos(t * 1.65 + b.phase) * 0.06;
        const dx = b.x - px;
        const dz = b.z - pz;
        const dist = Math.hypot(dx, dz);
        if (dist < 1.65 && dist > 0.01) {
          const push = (1.65 - dist) * 1.05;
          tiltX += (dz / dist) * push;
          tiltZ -= (dx / dist) * push;
        }
      }

      const h = b.height * lodScale;
      dummy.position.set(b.x, 0.18 * h, b.z);
      dummy.rotation.set(tiltX, b.yaw, tiltZ);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      dirty = true;
    }

    if (dirty) inst.instanceMatrix.needsUpdate = true;
  });

  if (blades.length === 0) return null;

  return (
    <instancedMesh
      ref={mesh}
      args={[BLADE_GEO, BLADE_MAT, blades.length]}
      castShadow={false}
      receiveShadow={false}
      frustumCulled={false}
    />
  );
}
