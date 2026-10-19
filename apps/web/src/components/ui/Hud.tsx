"use client";

export function Hud() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-between p-4 pt-16">
      <div className="pointer-events-auto glass-panel px-4 py-2">
        <p className="font-display text-sm text-arcane-glow">Archipelago of Arcanum</p>
        <p className="text-xs text-slate-400">Sahil Verma · Observatory realm</p>
      </div>
    </header>
  );
}
