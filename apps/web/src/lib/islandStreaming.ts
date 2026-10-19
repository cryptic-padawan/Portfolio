/** World units — only foliage props within this radius of the avatar are mounted. */
export function streamRadiusForTier(tier: 0 | 1 | 2 | 3): number {
  if (tier <= 1) return 20;
  if (tier === 2) return 24;
  return 28;
}

export function inStreamRange(
  x: number,
  z: number,
  centerX: number,
  centerZ: number,
  radius: number,
): boolean {
  const dx = x - centerX;
  const dz = z - centerZ;
  return dx * dx + dz * dz <= radius * radius;
}

/** Distance from point to segment AB (XZ plane). */
export function distToSegmentXZ(
  px: number,
  pz: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
): number {
  const abx = bx - ax;
  const abz = bz - az;
  const lenSq = abx * abx + abz * abz;
  if (lenSq < 1e-6) return Math.hypot(px - ax, pz - az);
  let t = ((px - ax) * abx + (pz - az) * abz) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const qx = ax + t * abx;
  const qz = az + t * abz;
  return Math.hypot(px - qx, pz - qz);
}

export function spokeInStream(
  poiX: number,
  poiZ: number,
  centerX: number,
  centerZ: number,
  radius: number,
): boolean {
  if (inStreamRange(poiX, poiZ, centerX, centerZ, radius + 4)) return true;
  if (inStreamRange(0, 0, centerX, centerZ, radius + 2)) return true;
  return distToSegmentXZ(centerX, centerZ, 0, 0, poiX, poiZ) <= radius + 2;
}

/** Quantized grid step for grass regen (avoids rebuilding every frame). */
export function streamGrassBucket(x: number, z: number, step = 10): string {
  return `${Math.floor(x / step)},${Math.floor(z / step)}`;
}
