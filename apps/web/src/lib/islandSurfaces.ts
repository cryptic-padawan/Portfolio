import {
  HUB_PAVEMENT_RADIUS,
  HUB_RADIUS,
  PATH_HALF_WIDTH,
  POI_ALTAR_OUTER_RADIUS,
  isNearAnyPath,
} from "@/lib/islandTerrain";
import { WORLD_POIS } from "@/lib/worldPois";

/** Walkable top of cobble paths (bed + flagstone extrusion). */
const PATH_SURFACE_Y = 0.22;
/** Central hub deck + outer ring. */
const HUB_SURFACE_Y = 0.24;
/** Extra sole clearance on paved surfaces (rig feet sit above logical plane). */
const PAVEMENT_FOOT_LIFT = 0.08;
/** Max vertical step per frame (prevents jumping through tier walls). */
const MAX_STEP_UP = 0.36;

function altarSurfaceY(dist: number): number | null {
  if (dist > POI_ALTAR_OUTER_RADIUS + 0.08) return null;
  if (dist <= POI_ALTAR_OUTER_RADIUS * 0.48) return 0.42;
  if (dist <= POI_ALTAR_OUTER_RADIUS * 0.72) return 0.32;
  return 0.23;
}

export function getSurfaceHeight(x: number, z: number): number {
  let y = 0;

  if (isNearAnyPath(x, z, PATH_HALF_WIDTH + 0.68)) {
    y = Math.max(y, PATH_SURFACE_Y);
  }

  const hubDist = Math.hypot(x, z);
  if (hubDist <= HUB_PAVEMENT_RADIUS + 0.1) {
    y = Math.max(y, HUB_SURFACE_Y);
  }

  for (const poi of WORLD_POIS) {
    const px = poi.world[0];
    const pz = poi.world[2];
    const ay = altarSurfaceY(Math.hypot(x - px, z - pz));
    if (ay !== null) y = Math.max(y, ay);
  }

  return y;
}

/** Horizontal move with step-up limit; returns final xz + surface Y for avatar root. */
export function resolveSurfaceMovement(
  px: number,
  pz: number,
  nx: number,
  nz: number,
): [number, number, number] {
  const currentY = getSurfaceHeight(px, pz);
  const nextY = getSurfaceHeight(nx, nz);

  if (nextY - currentY > MAX_STEP_UP) {
    return [px, pz, currentY];
  }

  return [nx, nz, nextY];
}

export function avatarRootY(surfaceY: number, footOffset: number): number {
  const lift = surfaceY > 0.05 ? PAVEMENT_FOOT_LIFT : 0;
  return surfaceY + footOffset + lift;
}

/** For debug / minimap — hub inner vs ring radii (visual fill). */
export const HUB_INNER_STONE_RADIUS = HUB_RADIUS - 0.22;
export const HUB_RING_INNER = HUB_RADIUS - 0.28;
export const HUB_RING_OUTER = HUB_PAVEMENT_RADIUS + 0.08;
