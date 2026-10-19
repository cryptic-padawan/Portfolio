"use client";

import Link from "next/link";
import { GAME_REGISTRY } from "@arcanum/game-core";
import { useWorldStore } from "@/store/worldStore";

export function GamesPanel() {
  const setPanel = useWorldStore((s) => s.setPanel);

  return (
    <aside className="glass-panel fixed bottom-4 left-4 right-4 z-30 p-5 md:left-auto md:w-[24rem]">
      <div className="flex justify-between">
        <h2 className="font-display text-lg text-arcane-glow">Game Table</h2>
        <button type="button" className="text-slate-400" onClick={() => setPanel("none")}>
          ✕
        </button>
      </div>
      <ul className="mt-3 space-y-2">
        {Object.entries(GAME_REGISTRY).map(([id, game]) => (
          <li key={id}>
            {game.status === "playable" ? (
              <Link
                href={game.path}
                className="block rounded-lg border border-white/10 px-3 py-2 text-sm hover:border-arcane-glow/40"
              >
                {game.title}
              </Link>
            ) : (
              <span className="block rounded-lg border border-white/5 px-3 py-2 text-sm text-slate-500">
                {game.title} — soon
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
