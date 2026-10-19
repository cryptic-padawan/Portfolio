"use client";

import { Html } from "@react-three/drei/web/Html";
import { useProgress } from "@react-three/drei/core/Progress";

export function LoaderOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <Html center fullscreen>
      <div className="glass-panel px-6 py-4 text-center">
        <p className="font-display text-arcane-glow">Loading realm…</p>
        <p className="mt-1 text-sm text-slate-400">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}
