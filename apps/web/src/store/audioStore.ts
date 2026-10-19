import { create } from "zustand";

type AudioState = {
  consent: "unknown" | "granted" | "denied";
  volume: number;
  setConsent: (consent: AudioState["consent"]) => void;
  setVolume: (volume: number) => void;
};

export const useAudioStore = create<AudioState>((set) => ({
  consent: "unknown",
  volume: 0.08,
  setConsent: (consent) => set({ consent }),
  setVolume: (volume) => set({ volume }),
}));
