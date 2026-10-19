import { create } from "zustand";

export type NightTransitionPhase = "idle" | "sky" | "scenery" | "atmosphere" | "torches";
export type NightTransitionDirection = "to-night" | "to-day" | null;

type NightState = {
  isNight: boolean;
  visualNight: boolean;
  sceneryNight: boolean;
  atmosphereNight: boolean;
  torchesActive: boolean;
  transitionPhase: NightTransitionPhase;
  transitionBusy: boolean;
  transitionDirection: NightTransitionDirection;
  requestToggleNight: () => void;
  setNight: (on: boolean) => void;
  _advanceTransition: (phase: NightTransitionPhase) => void;
  _finishTransition: () => void;
  _resetDay: () => void;
};

export const useNightStore = create<NightState>((set, get) => ({
  isNight: false,
  visualNight: false,
  sceneryNight: false,
  atmosphereNight: false,
  torchesActive: false,
  transitionPhase: "idle",
  transitionBusy: false,
  transitionDirection: null,

  requestToggleNight: () => {
    const s = get();
    if (s.transitionBusy) return;

    if (!s.isNight) {
      set({
        transitionBusy: true,
        transitionDirection: "to-night",
        transitionPhase: "sky",
        visualNight: true,
        isNight: true,
        sceneryNight: false,
        atmosphereNight: false,
        torchesActive: false,
      });
      return;
    }

    set({
      transitionBusy: true,
      transitionDirection: "to-day",
      transitionPhase: "sky",
      torchesActive: false,
    });
  },

  setNight: (on) => {
    if (on) {
      set({
        isNight: true,
        visualNight: true,
        sceneryNight: true,
        atmosphereNight: true,
        torchesActive: true,
        transitionPhase: "idle",
        transitionBusy: false,
        transitionDirection: null,
      });
    } else {
      get()._resetDay();
    }
  },

  _advanceTransition: (phase) => {
    if (phase === "scenery") set({ transitionPhase: phase, sceneryNight: true });
    else if (phase === "atmosphere") set({ transitionPhase: phase, atmosphereNight: true });
    else if (phase === "torches") set({ transitionPhase: phase, torchesActive: true });
    else set({ transitionPhase: phase });
  },

  _finishTransition: () =>
    set({ transitionPhase: "idle", transitionBusy: false, transitionDirection: null }),

  _resetDay: () =>
    set({
      isNight: false,
      visualNight: false,
      sceneryNight: false,
      atmosphereNight: false,
      torchesActive: false,
      transitionPhase: "idle",
      transitionBusy: false,
      transitionDirection: null,
    }),
}));
