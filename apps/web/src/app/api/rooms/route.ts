import { NextResponse } from "next/server";
import {
  generateRoomCode,
  ROOM_TTL_SECONDS,
  type GameId,
  type RoomSnapshot,
} from "@arcanum/game-core";
import { redisGet, redisSetEx } from "@/lib/redis";

export async function POST(request: Request) {
  const body = (await request.json()) as { gameId?: GameId; hostId?: string };
  const gameId = body.gameId ?? "ludo";
  const hostId = body.hostId ?? "host";
  const code = generateRoomCode();
  const now = Date.now();
  const room: RoomSnapshot = {
    code,
    gameId,
    hostId,
    playerIds: [hostId],
    createdAt: now,
    expiresAt: now + ROOM_TTL_SECONDS * 1000,
  };
  const ok = await redisSetEx(`room:${code}`, ROOM_TTL_SECONDS, JSON.stringify(room));
  if (!ok) {
    return NextResponse.json(
      { error: "Room service unavailable (start Redis on 6392 or configure Upstash)" },
      { status: 503 },
    );
  }
  return NextResponse.json(room);
}

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }
  const raw = await redisGet(`room:${code.toUpperCase()}`);
  if (!raw) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  return NextResponse.json(JSON.parse(raw) as RoomSnapshot);
}
