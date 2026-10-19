"use client";

import { getTreeById } from "@/lib/islandForest";
import { useFruitStore } from "@/store/fruitStore";

function CircularProgress({ progress, label }: { progress: number; label: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(15,23,42,0.55)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="5"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          strokeLinecap="round"
        />
      </svg>
      <span className="font-sans text-[10px] font-bold uppercase tracking-wide text-amber-100">{label}</span>
    </div>
  );
}

const panelClass =
  "rounded-2xl border border-lime-300/45 bg-slate-950/92 px-4 py-3 shadow-[0_4px_28px_rgba(0,0,0,0.65)] backdrop-blur-md";

export function FruitInteractionPanel() {
  const phase = useFruitStore((s) => s.phase);
  const consumeProgress = useFruitStore((s) => s.consumeProgress);
  const nearbyTreeId = useFruitStore((s) => s.nearbyTreeId);
  const activeTreeId = useFruitStore((s) => s.activeTreeId);
  const eatenTreeIds = useFruitStore((s) => s.eatenTreeIds);
  const beginConsume = useFruitStore((s) => s.beginConsume);

  const treeId = phase === "consuming" ? activeTreeId : nearbyTreeId;
  if (!treeId) return null;
  const tree = getTreeById(treeId);
  if (!tree?.hasFruit || eatenTreeIds.includes(treeId)) return null;

  if (phase === "consuming") {
    const status =
      consumeProgress < 0.38 ? "Reaching for knowledge fruit…" : "Studying the flavor of code…";
    return (
      <div className={`${panelClass} flex w-[min(72vw,14rem)] flex-col items-center gap-2 text-center`}>
        <CircularProgress progress={consumeProgress} label="Eat" />
        <p className="font-sans text-xs font-semibold leading-snug text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {status}
        </p>
      </div>
    );
  }

  return (
    <div className={`${panelClass} flex w-[min(72vw,14rem)] flex-col items-center gap-2 text-center`}>
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-lime-300">Knowledge fruit</p>
      <p className="font-sans text-base font-bold text-white">Edible</p>
      <button
        type="button"
        className="rounded-xl border border-amber-400/55 bg-amber-500 px-4 py-1.5 font-sans text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400"
        onClick={() => beginConsume(treeId)}
      >
        Eat fruit
      </button>
    </div>
  );
}
