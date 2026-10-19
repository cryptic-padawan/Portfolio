export type PoiId =
  | "spire-gate"
  | "chronicle-hall"
  | "sending-stone"
  | "cozy-hearth"
  | "neon-arcade"
  | "orbital-dock";

export type PanelId = "none" | "resume" | "contact" | "games";

export type PoiKind = "gate" | "hall" | "stone" | "hearth" | "arcade" | "dock";

export type WorldPoi = {
  id: PoiId;
  label: string;
  kind: PoiKind;
  accent: string;
  mapIcon: "◆" | "▣" | "●" | "⌂" | "⚡" | "◎";
  interactLabel: string;
  map: { x: number; y: number };
  world: [number, number, number];
  panel: PanelId;
};

/** Walkable island disc — keep in sync with ArcanumIsland mesh and physics floor. */
export const ISLAND_DISC_RADIUS = 38;

/** Character spawn on the central stone hub. */
export const ISLAND_SPAWN: [number, number, number] = [0, 0, 0];

const MAP_CX = 50;
const MAP_CY = 52;
const MAP_SCALE_X = 42 / ISLAND_DISC_RADIUS;
const MAP_SCALE_Z = 38 / ISLAND_DISC_RADIUS;

export function worldToMap(worldX: number, worldZ: number): { x: number; y: number } {
  return {
    x: MAP_CX + worldX * MAP_SCALE_X,
    y: MAP_CY + worldZ * MAP_SCALE_Z,
  };
}

export const POI_INTERACT_RADIUS = 4.5;

const ARRIVAL_OFFSET = 3.5;

export function poiArrivalPoint(poi: WorldPoi): [number, number] {
  const [x, , z] = poi.world;
  const len = Math.hypot(x, z);
  if (len < 1e-3) return [x, z + ARRIVAL_OFFSET];
  return [x - (x / len) * ARRIVAL_OFFSET, z - (z / len) * ARRIVAL_OFFSET];
}

const POI_DEFS: Omit<WorldPoi, "map">[] = [
  {
    id: "spire-gate",
    label: "Observatory Gate",
    kind: "gate",
    accent: "#9ae8ff",
    mapIcon: "◆",
    interactLabel: "Enter the observatory path",
    world: [0, 0, 31],
    panel: "none",
  },
  {
    id: "chronicle-hall",
    label: "Chronicle Hall",
    kind: "hall",
    accent: "#e8c872",
    mapIcon: "▣",
    interactLabel: "Read career chronicle",
    world: [27, 0, 16],
    panel: "resume",
  },
  {
    id: "sending-stone",
    label: "Sending Stone",
    kind: "stone",
    accent: "#b794f6",
    mapIcon: "●",
    interactLabel: "Open contact sending stone",
    world: [-27, 0, 16],
    panel: "contact",
  },
  {
    id: "cozy-hearth",
    label: "Cozy Hearth",
    kind: "hearth",
    accent: "#f6ad55",
    mapIcon: "⌂",
    interactLabel: "Browse game table",
    world: [0, 0, -30],
    panel: "games",
  },
  {
    id: "neon-arcade",
    label: "Neon Circuit",
    kind: "arcade",
    accent: "#63b3ed",
    mapIcon: "⚡",
    interactLabel: "Enter neon arcade",
    world: [26, 0, -15],
    panel: "games",
  },
  {
    id: "orbital-dock",
    label: "Orbital Dock",
    kind: "dock",
    accent: "#68d391",
    mapIcon: "◎",
    interactLabel: "Inspect orbital dock",
    world: [-26, 0, -15],
    panel: "none",
  },
];

export const WORLD_POIS: WorldPoi[] = POI_DEFS.map((poi) => ({
  ...poi,
  map: worldToMap(poi.world[0], poi.world[2]),
}));

export function getPoi(id: PoiId): WorldPoi {
  return WORLD_POIS.find((p) => p.id === id) ?? WORLD_POIS[0];
}

export function findNearestPoi(x: number, z: number): WorldPoi | null {
  let best: WorldPoi | null = null;
  let bestDist = POI_INTERACT_RADIUS;
  for (const poi of WORLD_POIS) {
    const d = Math.hypot(x - poi.world[0], z - poi.world[2]);
    if (d < bestDist) {
      bestDist = d;
      best = poi;
    }
  }
  return best;
}
