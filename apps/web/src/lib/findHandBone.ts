import * as THREE from "three";

function normBoneName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function findRightHandBone(root: THREE.Object3D): THREE.Bone | null {
  let fallback: THREE.Bone | null = null;
  root.traverse((obj) => {
    if (!(obj as THREE.Bone).isBone) return;
    const n = normBoneName(obj.name);
    if (n === "mixamorigrighthand" || n.endsWith("righthand")) {
      fallback = obj as THREE.Bone;
    } else if (!fallback && n.includes("hand") && !n.includes("left") && !n.includes("thumb")) {
      fallback = obj as THREE.Bone;
    }
  });
  return fallback;
}
