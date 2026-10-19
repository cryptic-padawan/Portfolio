import { islandRuntime } from "@/lib/islandRuntime";
import { inStreamRange } from "@/lib/islandStreaming";
import { ISLAND_TORCHES } from "@/lib/torchLayout";
import { ISLAND_DISC_RADIUS, WORLD_POIS } from "@/lib/worldPois";
import { isOnPavement, POI_ALTAR_CORE_RADIUS } from "@/lib/islandTerrain";

export type IslandObstacle = { x: number; z: number; radius: number };

export type IslandTree = {
  id: string;
  x: number;
  z: number;
  seed: number;
  scale: number;
  hasFruit: boolean;
};
export type IslandRock = { x: number; z: number; s: number; rot: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const R = ISLAND_DISC_RADIUS;

function buildForest() {
  const rand = mulberry32(42);
  const trees: IslandTree[] = [];
  let attempts = 0;
  while (trees.length < 52 && attempts < 500) {
    attempts++;
    const ang = rand() * Math.PI * 2;
    const rad = 9 + rand() * (R - 10);
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    if (Math.hypot(x, z) < 8) continue;
    if (isOnPavement(x, z, 1.4)) continue;
    const scale = 0.85 + rand() * 0.45;
    trees.push({
      id: `tree-${trees.length}`,
      x,
      z,
      seed: rand() * 20,
      scale,
      hasFruit: false,
    });
  }

  const fruitRand = mulberry32(91);
  const fruitCandidates = trees.filter((t) => {
    const d = Math.hypot(t.x, t.z);
    return d > 14 && d < R - 4;
  });
  for (let i = fruitCandidates.length - 1; i > 0; i--) {
    const j = Math.floor(fruitRand() * (i + 1));
    [fruitCandidates[i], fruitCandidates[j]] = [fruitCandidates[j]!, fruitCandidates[i]!];
  }
  for (let f = 0; f < Math.min(14, fruitCandidates.length); f++) {
    fruitCandidates[f]!.hasFruit = true;
  }

  const randRock = mulberry32(17);
  const rocks: IslandRock[] = [];
  for (let i = 0; i < 18; i++) {
    const ang = randRock() * Math.PI * 2;
    const rad = 12 + randRock() * (R - 14);
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    if (isOnPavement(x, z, 1.0)) continue;
    rocks.push({
      x,
      z,
      s: 0.6 + randRock() * 1.2,
      rot: randRock() * Math.PI,
    });
  }

  const obstacles: IslandObstacle[] = [
    ...trees.map((t) => ({ x: t.x, z: t.z, radius: 0.95 * t.scale })),
    ...rocks.map((r) => ({ x: r.x, z: r.z, radius: 0.55 * r.s + 0.35 })),
  ];

  return { trees, rocks, obstacles };
}

const forest = buildForest();

export const ISLAND_TREES = forest.trees;
export const FRUIT_TREES = ISLAND_TREES.filter((t) => t.hasFruit);
export const ISLAND_ROCKS = forest.rocks;
export const ISLAND_OBSTACLES = forest.obstacles;

export function getTreeById(id: string): IslandTree | undefined {
  return ISLAND_TREES.find((t) => t.id === id);
}

function pushCircle(x: number, z: number, ox: number, oz: number, radius: number) {
  const dx = x - ox;
  const dz = z - oz;
  const d = Math.hypot(dx, dz);
  if (d < radius && d > 1e-4) {
    const push = (radius - d) / d;
    return [x + dx * push, z + dz * push] as [number, number];
  }
  return [x, z] as [number, number];
}

function obstacleActive(ox: number, oz: number, radius: number, px: number, pz: number, streamR: number) {
  return inStreamRange(ox, oz, px, pz, streamR + radius + 0.5);
}

export function resolveObstacleCollisions(nx: number, nz: number): [number, number] {
  let x = nx;
  let z = nz;
  const px = islandRuntime.posX;
  const pz = islandRuntime.posZ;
  const streamR = islandRuntime.streamRadius;

  for (const o of ISLAND_OBSTACLES) {
    if (!obstacleActive(o.x, o.z, o.radius, px, pz, streamR)) continue;
    [x, z] = pushCircle(x, z, o.x, o.z, o.radius);
  }

  for (const tor of ISLAND_TORCHES) {
    if (!obstacleActive(tor.x, tor.z, tor.radius, px, pz, streamR)) continue;
    [x, z] = pushCircle(x, z, tor.x, tor.z, tor.radius);
  }

  for (const poi of WORLD_POIS) {
    const pox = poi.world[0];
    const poz = poi.world[2];
    if (!obstacleActive(pox, poz, POI_ALTAR_CORE_RADIUS, px, pz, streamR)) continue;
    [x, z] = pushCircle(x, z, pox, poz, POI_ALTAR_CORE_RADIUS);
  }

  const dist = Math.hypot(x, z);
  if (dist > R) {
    x *= R / dist;
    z *= R / dist;
  }
  return [x, z];
}
