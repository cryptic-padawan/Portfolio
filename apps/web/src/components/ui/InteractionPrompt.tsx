"use client";

import { getPoi } from "@/lib/worldPois";
import { useWorldStore } from "@/store/worldStore";

export function InteractionPrompt() {
  const nearbyPoiId = useWorldStore((s) => s.nearbyPoiId);
  const panel = useWorldStore((s) => s.panel);
  const interactNearby = useWorldStore((s) => s.interactNearby);

  if (!nearbyPoiId || panel !== "none") return null;

  const poi = getPoi(nearbyPoiId);

  return (
    <div className="pointer-events-auto fixed bottom-16 left-1/2 z-30 -translate-x-1/2">
      <button
        type="button"
        className="rounded-full border border-arcane-glow/50 bg-arcane-night/90 px-5 py-2 text-sm text-white shadow-lg backdrop-blur-md hover:border-arcane-glow"
        onClick={() => interactNearby()}
      >
        <span className="font-mono text-arcane-glow">[E]</span> {poi.interactLabel}
        <span className="ml-2 text-xs text-slate-400">· {poi.label}</span>
      </button>
    </div>
  );
}
