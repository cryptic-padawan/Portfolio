"use client";

import Link from "next/link";
import { useAvatarStore } from "@/store/avatarStore";
import { useWorldStore } from "@/store/worldStore";

/** Top-center actions (panels open from POI interactions on the island). */
export function ConsoleNav() {
  const setCreatorOpen = useAvatarStore((s) => s.setCreatorOpen);
  const setCharacterProfileOpen = useWorldStore((s) => s.setCharacterProfileOpen);

  return (
    <nav className="pointer-events-auto fixed left-1/2 top-4 z-20 flex -translate-x-1/2 gap-1 rounded-full border border-white/10 bg-black/45 px-2 py-1 backdrop-blur-md">
      <button
        type="button"
        className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        onClick={() => {
          setCharacterProfileOpen(false);
          setCreatorOpen(true);
        }}
      >
        Edit avatar
      </button>
      <Link
        href="/classic"
        className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        2D mode
      </Link>
    </nav>
  );
}
