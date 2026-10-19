import { create } from "zustand";
import { setIslandPosition } from "@/lib/islandRuntime";
import {
  findNearestPoi,
  getPoi,
  ISLAND_SPAWN,
  poiArrivalPoint,
  type PanelId,
  type PoiId,
} from "@/lib/worldPois";

export type TeleportPhase = "idle" | "blink-out" | "blink-in";

type WorldState = {
  activePoiId: PoiId;
  nearbyPoiId: PoiId | null;
  panel: PanelId;
  teleportPhase: TeleportPhase;
  playerPosition: [number, number, number];
  cameraFocus: [number, number, number];
  teleportTick: number;
  isMoving: boolean;
  isRunning: boolean;
  characterProfileOpen: boolean;
  setPanel: (panel: PanelId) => void;
  setCharacterProfileOpen: (open: boolean) => void;
  toggleCharacterProfile: () => void;
  teleportTo: (poiId: PoiId) => void;
  setTeleportPhase: (phase: TeleportPhase) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setNearbyPoiId: (id: PoiId | null) => void;
  setIsMoving: (moving: boolean) => void;
  setIsRunning: (running: boolean) => void;
  interactNearby: () => void;
  updateProximity: (x: number, z: number) => void;
};

export const useWorldStore = create<WorldState>((set, get) => ({
  activePoiId: "spire-gate",
  nearbyPoiId: null,
  panel: "none",
  teleportPhase: "idle",
  playerPosition: [...ISLAND_SPAWN],
  cameraFocus: [ISLAND_SPAWN[0], 1.2, ISLAND_SPAWN[2]],
  teleportTick: 0,
  isMoving: false,
  isRunning: false,
  characterProfileOpen: false,
  setPanel: (panel) =>
    set((s) => ({
      panel,
      characterProfileOpen: panel !== "none" ? false : s.characterProfileOpen,
    })),
  setCharacterProfileOpen: (characterProfileOpen) =>
    set({ characterProfileOpen, panel: characterProfileOpen ? "none" : get().panel }),
  toggleCharacterProfile: () => {
    const next = !get().characterProfileOpen;
    set({ characterProfileOpen: next, panel: next ? "none" : get().panel });
  },
  setTeleportPhase: (teleportPhase) => set({ teleportPhase }),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  setNearbyPoiId: (nearbyPoiId) => set({ nearbyPoiId }),
  setIsMoving: (isMoving) => set({ isMoving }),
  setIsRunning: (isRunning) => set({ isRunning }),
  interactNearby: () => {
    const id = get().nearbyPoiId;
    if (!id) return;
    const poi = getPoi(id);
    set({ activePoiId: id });
    if (poi.panel !== "none") set({ panel: poi.panel, characterProfileOpen: false });
  },
  updateProximity: (x, z) => {
    const near = findNearestPoi(x, z);
    const next = near?.id ?? null;
    if (get().nearbyPoiId !== next) set({ nearbyPoiId: next });
  },
  teleportTo: (poiId) => {
    const poi = getPoi(poiId);
    if (get().teleportPhase !== "idle") return;
    set({
      activePoiId: poiId,
      teleportPhase: "blink-out",
      panel: "none",
      characterProfileOpen: false,
      nearbyPoiId: null,
    });
    const [ax, az] = poiArrivalPoint(poi);
    window.setTimeout(() => {
      setIslandPosition(ax, az);
      set({
        playerPosition: [ax, 0, az],
        cameraFocus: [ax, 1.2, az],
        teleportPhase: "blink-in",
        teleportTick: get().teleportTick + 1,
      });
      window.setTimeout(() => {
        set({ teleportPhase: "idle" });
        get().updateProximity(ax, az);
      }, 450);
    }, 380);
  },
}));
