export type Board = number[][];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function valid(board: Board, row: number, col: number, n: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === n || board[i][col] === n) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (board[r][c] === n) return false;
    }
  }
  return true;
}

function solve(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) continue;
      for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (!valid(board, r, c, n)) continue;
        board[r][c] = n;
        if (solve(board)) return true;
        board[r][c] = 0;
      }
      return false;
    }
  }
  return true;
}

export function generatePuzzle(clues = 36): { puzzle: Board; solution: Board } {
  const solution: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(solution);
  const puzzle = solution.map((row) => [...row]);
  const cells = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number]),
  );
  let removed = 0;
  for (const [r, c] of cells) {
    if (removed >= 81 - clues) break;
    puzzle[r][c] = 0;
    removed++;
  }
  return { puzzle, solution };
}

export function botFillHint(puzzle: Board, solution: Board): [number, number, number] | null {
  const empty: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return null;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  return [r, c, solution[r][c]];
}
