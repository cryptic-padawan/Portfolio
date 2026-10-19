import { WORLD_POIS } from "@/lib/worldPois";

export const HUB_RADIUS = 5.5;
export const PATH_HALF_WIDTH = 1.45;
export const POI_ALTAR_OUTER_RADIUS = 3.15;
/** Solid interactable core on each POI altar (props + capstone). */
/** Pedestal + floating orb at each POI. */
export const POI_ALTAR_CORE_RADIUS = 1.05;

export const HUB_PAVEMENT_RADIUS = HUB_RADIUS + 0.95;
const PATH_EDGE_MARGIN = PATH_HALF_WIDTH + 0.55;

export function distToSegment(
  px: number,
  pz: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
): number {
  const dx = bx - ax;
  const dz = bz - az;
  const lenSq = dx * dx + dz * dz;
  if (lenSq < 1e-6) return Math.hypot(px - ax, pz - az);
  let t = ((px - ax) * dx + (pz - az) * dz) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), pz - (az + t * dz));
}

export function isNearPoiAltar(x: number, z: number, extra = 0.35): boolean {
  for (const poi of WORLD_POIS) {
    const px = poi.world[0];
    const pz = poi.world[2];
    if (Math.hypot(x - px, z - pz) <= POI_ALTAR_OUTER_RADIUS + extra) return true;
  }
  return false;
}

export function isNearAnyPath(x: number, z: number, margin = PATH_HALF_WIDTH + 0.35): boolean {
  for (const poi of WORLD_POIS) {
    const px = poi.world[0];
    const pz = poi.world[2];
    if (distToSegment(x, z, 0, 0, px, pz) < margin) return true;
  }
  return false;
}

export function isOnPavement(x: number, z: number, extra = 0.2): boolean {
  if (Math.hypot(x, z) <= HUB_PAVEMENT_RADIUS + extra) return true;
  if (isNearPoiAltar(x, z, extra)) return true;
  return isNearAnyPath(x, z, PATH_HALF_WIDTH + 0.62 + extra);
}

/** Distance off pavement edge; negative = on stone/sand. */
export function clearanceFromPavement(x: number, z: number): number {
  let clearance = Math.hypot(x, z) - HUB_PAVEMENT_RADIUS;

  for (const poi of WORLD_POIS) {
    const px = poi.world[0];
    const pz = poi.world[2];
    const altar = Math.hypot(x - px, z - pz) - POI_ALTAR_OUTER_RADIUS;
    clearance = Math.min(clearance, altar);
    const path = distToSegment(x, z, 0, 0, px, pz) - PATH_EDGE_MARGIN;
    clearance = Math.min(clearance, path);
  }
  return clearance;
}

export function pathUnitVector(tx: number, tz: number): { ux: number; uz: number; len: number } {
  const len = Math.hypot(tx, tz);
  if (len < 1e-6) return { ux: 0, uz: 1, len: 0 };
  return { ux: tx / len, uz: tz / len, len };
}
