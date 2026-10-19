"use client";

export function ControlsGuide() {
  const items = [
    { keys: "W A S D / Arrows", label: "walk" },
    { keys: "Shift", label: "run" },
    { keys: "P", label: "profile" },
    { keys: "N", label: "night / day" },
    { keys: "E", label: "interact at beacon" },
    { keys: "Fruit trees", label: "Eat fruit when near" },
    { keys: "Drag", label: "orbit camera" },
    { keys: "Chart", label: "click beacon to travel" },
  ];

  return (
    <div className="pointer-events-none fixed bottom-3 left-1/2 z-20 w-[min(96vw,52rem)] -translate-x-1/2">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[10px] text-slate-200 backdrop-blur-md sm:text-xs">
        {items.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-slate-600 bg-slate-900/80 px-1.5 py-0.5 font-mono text-[10px] text-arcane-glow">
              {item.keys}
            </kbd>
            <span className="text-slate-400">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
