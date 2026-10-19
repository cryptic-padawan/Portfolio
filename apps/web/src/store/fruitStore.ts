import { create } from "zustand";
import { rollProficiencyToast } from "@/lib/proficiencyMessages";

export type FruitPhase = "idle" | "consuming";

export type ProficiencyToast = {
  title: string;
  body: string;
  skill: string;
};

type FruitState = {
  nearbyTreeId: string | null;
  activeTreeId: string | null;
  phase: FruitPhase;
  consumeProgress: number;
  eatenTreeIds: string[];
  toast: ProficiencyToast | null;
  setNearbyTreeId: (id: string | null) => void;
  beginConsume: (treeId: string) => void;
  tickConsume: (dt: number) => void;
  cancelInteraction: () => void;
  clearToast: () => void;
};

export const CONSUME_DURATION = 3.2;
/** Progress after which fruit leaves the tree and appears in hand. */
export const FRUIT_PLUCK_AT = 0.38;
export const useFruitStore = create<FruitState>((set, get) => ({
  nearbyTreeId: null,
  activeTreeId: null,
  phase: "idle",
  consumeProgress: 0,
  eatenTreeIds: [],
  toast: null,
  setNearbyTreeId: (nearbyTreeId) => {
    if (get().phase !== "idle") return;
    set({ nearbyTreeId });
  },
  beginConsume: (treeId) => {
    const { phase, eatenTreeIds } = get();
    if (phase !== "idle" || eatenTreeIds.includes(treeId)) return;
    set({
      activeTreeId: treeId,
      phase: "consuming",
      consumeProgress: 0,
    });
  },
  tickConsume: (dt) => {
    const s = get();
    if (s.phase !== "consuming") return;
    const next = s.consumeProgress + dt / CONSUME_DURATION;
    if (next >= 1) {
      const treeId = s.activeTreeId;
      const toastPayload = rollProficiencyToast();
      set({
        phase: "idle",
        activeTreeId: null,
        consumeProgress: 0,
        eatenTreeIds: treeId ? [...s.eatenTreeIds, treeId] : s.eatenTreeIds,
        toast: toastPayload,
      });
      return;
    }
    set({ consumeProgress: next });
  },
  cancelInteraction: () => {
    set({
      phase: "idle",
      activeTreeId: null,
      consumeProgress: 0,
    });
  },
  clearToast: () => set({ toast: null }),
}));

export function fruitInHand(progress: number, phase: FruitPhase): boolean {
  return phase === "consuming" && progress >= FRUIT_PLUCK_AT && progress < 1;
}
