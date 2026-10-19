import { HUB_RING_OUTER } from "@/lib/islandSurfaces";
import {
  HUB_RADIUS,
  PATH_HALF_WIDTH,
  POI_ALTAR_OUTER_RADIUS,
  pathUnitVector,
} from "@/lib/islandTerrain";
import { WORLD_POIS } from "@/lib/worldPois";

export type IslandTorch = {
  id: string;
  x: number;
  z: number;
  yaw: number;
  radius: number;
};

/** Along-path spacing — one torch per step, alternating sides. */
const SPOKE_STEP = 6;
const MIN_TORCH_GAP = 4.2;
const EDGE_OFFSET = PATH_HALF_WIDTH + 0.72;

function canPlace(list: IslandTorch[], x: number, z: number): boolean {
  for (const t of list) {
    if (Math.hypot(t.x - x, t.z - z) < MIN_TORCH_GAP) return false;
  }
  return true;
}

function pushTorch(list: IslandTorch[], x: number, z: number, yaw: number) {
  if (!canPlace(list, x, z)) return;
  list.push({
    id: `torch-${list.length}`,
    x,
    z,
    yaw,
    radius: 0.28,
  });
}

function buildSpokeTorches(list: IslandTorch[]) {
  for (const poi of WORLD_POIS) {
    const tx = poi.world[0];
    const tz = poi.world[2];
    const { ux, uz, len } = pathUnitVector(tx, tz);
    const perpX = -uz;
    const perpZ = ux;
    const start = HUB_RADIUS + 0.8;
    const end = Math.max(start + 3, len - POI_ALTAR_OUTER_RADIUS + 0.2);

    let side = 0;
    for (let d = start; d <= end; d += SPOKE_STEP) {
      const cx = ux * d;
      const cz = uz * d;
      const yawL = Math.atan2(perpX, perpZ);
      if (side === 0) {
        pushTorch(list, cx + perpX * EDGE_OFFSET, cz + perpZ * EDGE_OFFSET, yawL);
      } else {
        pushTorch(list, cx - perpX * EDGE_OFFSET, cz - perpZ * EDGE_OFFSET, yawL + Math.PI);
      }
      side = 1 - side;
    }
  }
}

function buildHubTorches(list: IslandTorch[]) {
  const r = HUB_RING_OUTER + 0.38;
  const count = 12;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    pushTorch(list, x, z, a + Math.PI);
  }
}

function buildPoiTorches(list: IslandTorch[]) {
  const ringR = POI_ALTAR_OUTER_RADIUS + 0.38;
  const count = 6;
  for (const poi of WORLD_POIS) {
    const px = poi.world[0];
    const pz = poi.world[2];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + poi.id.length * 0.07;
      pushTorch(list, px + Math.cos(a) * ringR, pz + Math.sin(a) * ringR, a + Math.PI);
    }
  }
}

function buildTorches(): IslandTorch[] {
  const list: IslandTorch[] = [];
  buildSpokeTorches(list);
  buildHubTorches(list);
  buildPoiTorches(list);
  return list;
}

export const ISLAND_TORCHES = buildTorches();
