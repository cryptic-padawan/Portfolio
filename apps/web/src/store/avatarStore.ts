import { create } from "zustand";
import {
  BROKEN_LEGACY_RPM_URL,
  LOCAL_DEFAULT_MODEL,
  RPM_STORAGE_KEY,
  resolveAvatarModelUrl,
} from "@/lib/rpmAssets";

type AvatarState = {
  modelUrl: string;
  creatorOpen: boolean;
  hydrated: boolean;
  hydrate: () => void;
  setModelUrl: (url: string) => void;
  setCreatorOpen: (open: boolean) => void;
};

export const useAvatarStore = create<AvatarState>((set) => ({
  modelUrl: LOCAL_DEFAULT_MODEL,
  creatorOpen: false,
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(RPM_STORAGE_KEY);
    if (saved === BROKEN_LEGACY_RPM_URL) {
      localStorage.removeItem(RPM_STORAGE_KEY);
    }
    const envUrl = process.env.NEXT_PUBLIC_RPM_AVATAR_URL;
    const modelUrl = resolveAvatarModelUrl(
      saved === BROKEN_LEGACY_RPM_URL ? null : saved,
      envUrl,
    );
    set({ hydrated: true, modelUrl });
  },
  setModelUrl: (modelUrl) => {
    if (modelUrl === BROKEN_LEGACY_RPM_URL) {
      modelUrl = LOCAL_DEFAULT_MODEL;
    }
    localStorage.setItem(RPM_STORAGE_KEY, modelUrl);
    set({ modelUrl, creatorOpen: false });
  },
  setCreatorOpen: (creatorOpen) => set({ creatorOpen }),
}));
