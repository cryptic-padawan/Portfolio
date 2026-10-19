"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/components/games/GameShell";

const SudokuGame = dynamic(
  () => import("@/components/games/SudokuGame").then((m) => m.SudokuGame),
  { ssr: false, loading: () => <p className="text-sm text-slate-400">Loading Sudoku…</p> },
);

export function SudokuPageClient() {
  return (
    <GameShell title="Sudoku · Cozy Hearth">
      <SudokuGame />
    </GameShell>
  );
}
