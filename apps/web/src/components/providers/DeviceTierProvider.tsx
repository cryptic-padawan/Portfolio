"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getGPUTier } from "detect-gpu";

export type DeviceTier = 0 | 1 | 2 | 3;

type Ctx = {
  tier: DeviceTier;
  prefersReducedMotion: boolean;
  isMobile: boolean;
  ready: boolean;
};

const DeviceTierContext = createContext<Ctx>({
  tier: 2,
  prefersReducedMotion: false,
  isMobile: false,
  ready: false,
});

export function DeviceTierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<DeviceTier>(2);
  const [ready, setReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);

    getGPUTier()
      .then((result) => {
        let t = result.tier ?? 2;
        const ramGb = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
        if (ramGb !== undefined) {
          if (ramGb <= 4) t = Math.min(t, 1);
          else if (ramGb <= 8) t = Math.min(t, 2);
        }
        setTier(Math.min(3, Math.max(0, t)) as DeviceTier);
      })
      .catch(() => setTier(2))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({ tier, prefersReducedMotion, isMobile, ready }),
    [tier, prefersReducedMotion, isMobile, ready],
  );

  return (
    <DeviceTierContext.Provider value={value}>{children}</DeviceTierContext.Provider>
  );
}

export function useDeviceTier() {
  return useContext(DeviceTierContext);
}
