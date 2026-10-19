"use client";

import { useWorldStore } from "@/store/worldStore";
import { CharacterProfileCard } from "./CharacterProfileCard";

export function CharacterProfileHud() {
  const open = useWorldStore((s) => s.characterProfileOpen);
  const setCharacterProfileOpen = useWorldStore((s) => s.setCharacterProfileOpen);

  if (!open) return null;

  return (
    <div
      className="pointer-events-auto fixed z-20
        right-4 top-[21.5rem] w-[min(94vw,22.5rem)]
        md:right-[16.5rem] md:top-20"
      aria-live="polite"
    >
      <CharacterProfileCard onClose={() => setCharacterProfileOpen(false)} />
    </div>
  );
}
