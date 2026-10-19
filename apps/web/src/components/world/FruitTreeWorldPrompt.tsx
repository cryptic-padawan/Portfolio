"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard } from "@react-three/drei/core/Billboard";
import { Html } from "@react-three/drei/web/Html";
import * as THREE from "three";
import { getTreeById } from "@/lib/islandForest";
import { islandRuntime } from "@/lib/islandRuntime";
import { useFruitStore } from "@/store/fruitStore";
import { FruitInteractionPanel } from "./FruitInteractionPanel";

const _tree = new THREE.Vector3();
const _player = new THREE.Vector3();
const _cam = new THREE.Vector3();
const _toPlayer = new THREE.Vector3();
const _toCam = new THREE.Vector3();
const _pos = new THREE.Vector3();

export function FruitTreeWorldPrompt() {
  const anchorRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const phase = useFruitStore((s) => s.phase);
  const nearbyTreeId = useFruitStore((s) => s.nearbyTreeId);
  const activeTreeId = useFruitStore((s) => s.activeTreeId);
  const eatenTreeIds = useFruitStore((s) => s.eatenTreeIds);

  const show = Boolean(
    phase === "consuming"
      ? activeTreeId
      : nearbyTreeId && !eatenTreeIds.includes(nearbyTreeId),
  );

  useFrame(() => {
    const group = anchorRef.current;
    if (!group) return;

    const focusId = phase === "consuming" ? activeTreeId : nearbyTreeId;
    const tree = focusId ? getTreeById(focusId) : null;
    if (!tree || !show) {
      group.visible = false;
      return;
    }

    group.visible = true;
    const px = islandRuntime.posX;
    const pz = islandRuntime.posZ;

    _tree.set(tree.x, 0, tree.z);
    _player.set(px, 0, pz);
    _toPlayer.subVectors(_player, _tree);
    if (_toPlayer.lengthSq() < 0.01) _toPlayer.set(0, 0, 1);
    _toPlayer.normalize();

    _pos.copy(_tree).addScaledVector(_toPlayer, 1.05);
    _pos.y = 2.45;

    camera.getWorldPosition(_cam);
    _toCam.subVectors(_cam, _pos);
    _toCam.y = 0;
    if (_toCam.lengthSq() > 0.01) {
      _toCam.normalize().multiplyScalar(0.35);
      _pos.add(_toCam);
    }

    group.position.copy(_pos);
  });

  return (
    <group ref={anchorRef}>
      {show && (
        <Billboard follow>
          <Html
            center
            transform
            occlude={false}
            distanceFactor={11}
            zIndexRange={[45, 0]}
            style={{ pointerEvents: "auto", userSelect: "none" }}
          >
            <FruitInteractionPanel />
          </Html>
        </Billboard>
      )}
    </group>
  );
}
