import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __arcanumRedis: Redis | undefined;
}

export function getRedis(): Redis | null {
  const url = process.env.PORTFOLIO_REDIS_URL;
  if (!url) return null;
  if (!global.__arcanumRedis) {
    global.__arcanumRedis = new Redis(url, { maxRetriesPerRequest: 2 });
  }
  return global.__arcanumRedis;
}

export async function redisGet(key: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

export async function redisSetEx(
  key: string,
  ttlSeconds: number,
  value: string,
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  try {
    await redis.setex(key, ttlSeconds, value);
    return true;
  } catch {
    return false;
  }
}
