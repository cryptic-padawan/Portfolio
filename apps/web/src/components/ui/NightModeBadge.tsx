"use client";

import { useNightStore } from "@/store/nightStore";

export function NightModeBadge() {
  const visualNight = useNightStore((s) => s.visualNight);
  if (!visualNight) return null;

  return (
    <div className="pointer-events-none fixed left-4 top-[4.5rem] z-20 rounded-full border border-indigo-400/40 bg-slate-950/85 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-indigo-200 shadow-lg">
      Night realm · N to toggle
    </div>
  );
}
