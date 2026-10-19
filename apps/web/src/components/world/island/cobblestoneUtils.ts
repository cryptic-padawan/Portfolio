import * as THREE from "three";

export const STONE_COLORS = [
  "#9a9588",
  "#a89f92",
  "#b5aa9c",
  "#c4bdb2",
  "#8a8580",
  "#787268",
  "#70685e",
  "#ada498",
];

export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Flagstone = {
  x: number;
  y: number;
  z: number;
  geoIndex: number;
  ry: number;
  tiltX: number;
  tiltZ: number;
  color: string;
  scale: number;
};

const STONE_GEOS: THREE.BufferGeometry[] = [];

function buildIrregularStoneGeometries() {
  if (STONE_GEOS.length) return;
  for (let g = 0; g < 12; g++) {
    const rand = mulberry32(4000 + g);
    const verts = 6 + Math.floor(rand() * 3);
    const shape = new THREE.Shape();
    for (let i = 0; i < verts; i++) {
      const a = (i / verts) * Math.PI * 2 + (rand() - 0.5) * 0.22;
      const r = 0.12 + rand() * 0.08;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    shape.closePath();
    const depth = 0.045 + rand() * 0.03;
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.01,
      bevelSegments: 1,
      steps: 1,
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, depth * 0.5, 0);
    geo.computeVertexNormals();
    STONE_GEOS.push(geo);
  }
}

export function getStoneGeometries() {
  buildIrregularStoneGeometries();
  return STONE_GEOS;
}

function pushStone(
  stones: Flagstone[],
  idx: number,
  x: number,
  z: number,
  yBase: number,
  rand: () => number,
  seed: number,
) {
  stones.push({
    x,
    z,
    y: yBase + rand() * 0.008,
    geoIndex: (idx + seed) % 12,
    ry: rand() * Math.PI * 2,
    tiltX: (rand() - 0.5) * 0.03,
    tiltZ: (rand() - 0.5) * 0.03,
    color: STONE_COLORS[Math.floor(rand() * STONE_COLORS.length)],
    scale: 0.98 + rand() * 0.22,
  });
}

/** Staggered grid — dense overlap for continuous cobble surface. */
export function layoutPackedPathStones(
  rand: () => number,
  startD: number,
  endD: number,
  ux: number,
  uz: number,
  perpX: number,
  perpZ: number,
  yBase: number,
  seed: number,
  halfWidth: number,
): Flagstone[] {
  const stones: Flagstone[] = [];
  const stepAlong = 0.145;
  const stepAcross = 0.135;
  const rows = Math.ceil((halfWidth * 2.05) / stepAcross);
  let idx = 0;
  for (let d = startD; d <= endD; d += stepAlong) {
    const row = Math.floor((d - startD) / stepAlong);
    const stagger = (row % 2) * (stepAcross * 0.5);
    for (let c = 0; c <= rows; c++) {
      const lateral = -halfWidth + c * stepAcross + stagger + (rand() - 0.5) * 0.025;
      if (Math.abs(lateral) > halfWidth + 0.02) continue;
      pushStone(stones, idx++, ux * d + perpX * lateral, uz * d + perpZ * lateral, yBase, rand, seed);
    }
  }
  return stones;
}

/** Fill an annulus (ring) with packed cobbles. */
export function layoutPackedAnnulusStones(
  rand: () => number,
  innerR: number,
  outerR: number,
  yBase: number,
  seed: number,
): Flagstone[] {
  const stones: Flagstone[] = [];
  let idx = 0;
  for (let r = innerR; r <= outerR; r += 0.13) {
    const count = Math.max(8, Math.ceil((Math.PI * 2 * r) / 0.13));
    const ringStagger = (Math.floor(r * 10) % 2) * (Math.PI / count);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + ringStagger + (rand() - 0.5) * 0.1;
      const rad = r + (rand() - 0.5) * 0.04;
      if (rad < innerR - 0.02 || rad > outerR + 0.02) continue;
      pushStone(stones, idx++, Math.cos(a) * rad, Math.sin(a) * rad, yBase, rand, seed);
    }
  }
  return stones;
}

/** Concentric rings for hub / altar caps. */
export function layoutPackedDiscStones(
  rand: () => number,
  maxRadius: number,
  yBase: number,
  seed: number,
  minRadius = 0.15,
): Flagstone[] {
  const stones: Flagstone[] = [];
  let idx = 0;
  for (let r = minRadius; r <= maxRadius; r += 0.14) {
    const count = Math.max(6, Math.ceil((Math.PI * 2 * r) / 0.14));
    const ringStagger = (Math.floor(r * 10) % 2) * (Math.PI / count);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + ringStagger + (rand() - 0.5) * 0.08;
      const rad = r + (rand() - 0.5) * 0.04;
      pushStone(stones, idx++, Math.cos(a) * rad, Math.sin(a) * rad, yBase, rand, seed);
    }
  }
  return stones;
}

export function layoutJigsawStones(
  rand: () => number,
  countAlong: number,
  countAcross: number,
  mapPoint: (along: number, across: number, jitter: number) => { x: number; z: number } | null,
  yBase: number,
  seed: number,
): Flagstone[] {
  const stones: Flagstone[] = [];
  let idx = 0;
  for (let a = 0; a < countAlong; a++) {
    for (let c = 0; c < countAcross; c++) {
      const along = (a + 0.12 + (rand() - 0.5) * 0.08) / countAlong;
      const across = (c / (countAcross - 1 || 1)) * 2 - 1 + (rand() - 0.5) * 0.06;
      const p = mapPoint(along, across, rand());
      if (!p) continue;
      pushStone(stones, idx++, p.x, p.z, yBase, rand, seed);
    }
  }
  return stones;
}
