"use client";

import { useCallback, useEffect, useState } from "react";
import { botFillHint, generatePuzzle, type Board } from "@/lib/sudoku";

function cloneBoard(b: Board): Board {
  return b.map((row) => [...row]);
}

type PuzzlePack = { puzzle: Board; solution: Board };

export function SudokuGame() {
  const [pack, setPack] = useState<PuzzlePack | null>(null);
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    const next = generatePuzzle(34);
    setPack(next);
    setBoard(cloneBoard(next.puzzle));
  }, []);

  const fixed = pack?.puzzle;
  const solution = pack?.solution;

  const setCell = (r: number, c: number, v: number) => {
    if (!fixed || !board) return;
    if (fixed[r][c] !== 0) return;
    setBoard((prev) => {
      if (!prev) return prev;
      const next = cloneBoard(prev);
      next[r][c] = v;
      return next;
    });
  };

  const askBot = useCallback(() => {
    if (!board || !solution) return;
    const hint = botFillHint(board, solution);
    if (!hint) return;
    const [r, c, n] = hint;
    setCell(r, c, n);
  }, [board, solution]);

  if (!pack || !board || !fixed || !solution) {
    return <p className="text-sm text-slate-400">Shuffling the board…</p>;
  }

  const won = board.every((row, r) => row.every((n, c) => n === solution[r][c]));

  return (
    <div>
      <div className="grid grid-cols-9 gap-0.5">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const locked = fixed[r][c] !== 0;
            return (
              <input
                key={`${r}-${c}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={cell === 0 ? "" : String(cell)}
                readOnly={locked}
                aria-readonly={locked}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "").slice(-1);
                  const v = raw === "" ? 0 : parseInt(raw, 10);
                  setCell(r, c, Number.isNaN(v) ? 0 : v);
                }}
                className={`aspect-square w-full text-center text-sm ${
                  locked ? "bg-white/10 text-arcane-glow" : "bg-black/30"
                } ${(c + 1) % 3 === 0 && c < 8 ? "border-r border-white/20" : ""} ${
                  (r + 1) % 3 === 0 && r < 8 ? "border-b border-white/20" : ""
                }`}
              />
            );
          }),
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={askBot}
          className="rounded bg-arcane-mist px-3 py-1 text-sm"
        >
          Bot hint
        </button>
        <button
          type="button"
          onClick={() => setBoard(cloneBoard(fixed))}
          className="rounded border border-white/20 px-3 py-1 text-sm"
        >
          Reset
        </button>
      </div>
      {won && <p className="mt-3 text-sm text-green-400">Board complete — well done, traveler.</p>}
    </div>
  );
}
