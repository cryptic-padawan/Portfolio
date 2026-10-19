export type GameId = "sudoku" | "ludo" | "carrom" | "fps";

export type BotDifficulty = "easy" | "medium" | "hard";

export type RoomSnapshot = {
  code: string;
  gameId: GameId;
  hostId: string;
  playerIds: string[];
  createdAt: number;
  expiresAt: number;
};

export const GAME_REGISTRY: Record<
  GameId,
  { title: string; path: string; status: "playable" | "coming-soon" }
> = {
  sudoku: { title: "Sudoku", path: "/games/sudoku", status: "playable" },
  ludo: { title: "Ludo", path: "/games/ludo", status: "coming-soon" },
  carrom: { title: "Carrom", path: "/games/carrom", status: "coming-soon" },
  fps: { title: "Arena (future)", path: "/games/fps", status: "coming-soon" },
};

export function generateRoomCode(length = 6): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export const ROOM_TTL_SECONDS = 60 * 60 * 4;
