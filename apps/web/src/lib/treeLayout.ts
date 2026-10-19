export function treeRand(seed: number, n: number): number {
  const x = Math.sin(seed * 12.989 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export type TreeLayout = {
  trunkHeight: number;
  trunkTopY: number;
  canopyBaseY: number;
};

/** Shared layout so fruit / canopy align across the island. */
export function getTreeLayout(seed: number, scale = 1): TreeLayout {
  const trunkHeight = 2.65 * scale;
  const trunkTopY = trunkHeight * 0.42 + trunkHeight * 0.475;
  const canopyBaseY = trunkTopY - 0.55 * scale;
  return { trunkHeight, trunkTopY, canopyBaseY };
}

type FoliageBlob = { pos: [number, number, number]; r: number };

function foliageBlobs(seed: number): FoliageBlob[] {
  const blobs: FoliageBlob[] = [];
  for (let i = 0; i < 10; i++) {
    const a = treeRand(seed, i) * Math.PI * 2;
    const h = 0.65 + treeRand(seed, i + 3) * 2.15;
    const rad = 0.45 + treeRand(seed, i + 7) * 0.85;
    blobs.push({
      pos: [Math.cos(a) * rad * 0.7, h, Math.sin(a) * rad * 0.7],
      r: 0.62 + treeRand(seed, i + 11) * 0.5,
    });
  }
  return blobs;
}

/** Fruit positions on the outer shell of the canopy (local to canopy group). */
export function getTreeFruitPositions(seed: number): [number, number, number][] {
  const blobs = foliageBlobs(seed);
  const out: [number, number, number][] = [];

  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]!;
    const [bx, by, bz] = b.pos;
    const horiz = Math.hypot(bx, bz) || 1;
    const nx = bx / horiz;
    const nz = bz / horiz;
    const shell = b.r * 0.92;
    out.push([bx + nx * shell, by + b.r * 0.15, bz + nz * shell]);

    const a2 = treeRand(seed, 100 + i) * Math.PI * 2;
    out.push([
      bx + Math.cos(a2) * shell * 0.85,
      by + treeRand(seed, 110 + i) * b.r * 0.5,
      bz + Math.sin(a2) * shell * 0.85,
    ]);
  }

  return out;
}
