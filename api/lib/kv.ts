import { kv } from '@vercel/kv';

/**
 * In-memory fallback stores for local development without Vercel KV environment variables
 */
const localLikesStore = new Map<number, number>();
const localPendingMemories: any[] = [];
const localRateLimits = new Map<string, { count: number; resetAt: number }>();

function isKVConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// ============================================================
// PHOTO LIKES (Exclusively stored in KV - No GitHub Commits)
// ============================================================

export async function incrementPhotoLikes(photoId: number): Promise<number> {
  const key = `photo:${photoId}:likes`;
  if (isKVConfigured()) {
    try {
      const newCount = await kv.incr(key);
      return Number(newCount);
    } catch (err) {
      console.warn('KV increment failed, using local store fallback:', err);
    }
  }
  const current = (localLikesStore.get(photoId) || 0) + 1;
  localLikesStore.set(photoId, current);
  return current;
}

export async function getPhotoLikes(photoId: number): Promise<number | null> {
  const key = `photo:${photoId}:likes`;
  if (isKVConfigured()) {
    try {
      const val = await kv.get<number>(key);
      if (val !== null && val !== undefined) {
        return Number(val);
      }
    } catch (err) {
      console.warn('KV get failed, using local store fallback:', err);
    }
  }
  return localLikesStore.has(photoId) ? (localLikesStore.get(photoId) ?? null) : null;
}

export async function getAllPhotoLikes(photoIds: number[]): Promise<Record<number, number>> {
  const result: Record<number, number> = {};
  if (isKVConfigured() && photoIds.length > 0) {
    try {
      // Pipeline or mget
      const keys = photoIds.map((id) => `photo:${id}:likes`);
      const values = await kv.mget<(number | null)[]>(...keys);
      photoIds.forEach((id, idx) => {
        const val = values[idx];
        if (val !== null && val !== undefined) {
          result[id] = Number(val);
        }
      });
      return result;
    } catch (err) {
      console.warn('KV mget failed, using local fallback:', err);
    }
  }
  for (const id of photoIds) {
    if (localLikesStore.has(id)) {
      result[id] = localLikesStore.get(id)!;
    }
  }
  return result;
}

// ============================================================
// PENDING MEMORIES QUEUE (Unmoderated submissions)
// ============================================================

const PENDING_MEMORIES_KEY = 'queue:memories:pending';

export async function pushPendingMemory(memory: any): Promise<void> {
  if (isKVConfigured()) {
    try {
      await kv.rpush(PENDING_MEMORIES_KEY, memory);
      return;
    } catch (err) {
      console.warn('KV rpush failed, using local queue fallback:', err);
    }
  }
  localPendingMemories.push(memory);
}

export async function getPendingMemories(): Promise<any[]> {
  if (isKVConfigured()) {
    try {
      const list = await kv.lrange<any>(PENDING_MEMORIES_KEY, 0, -1);
      return Array.isArray(list) ? list : [];
    } catch (err) {
      console.warn('KV lrange failed, using local queue fallback:', err);
    }
  }
  return [...localPendingMemories];
}

export async function removePendingMemory(id: number | string): Promise<any | null> {
  const targetId = Number(id);
  if (isKVConfigured()) {
    try {
      const list = await kv.lrange<any>(PENDING_MEMORIES_KEY, 0, -1);
      if (Array.isArray(list)) {
        const item = list.find((m) => Number(m.id) === targetId);
        if (item) {
          await kv.lrem(PENDING_MEMORIES_KEY, 1, item);
          return item;
        }
      }
    } catch (err) {
      console.warn('KV lrem failed, trying local queue fallback:', err);
    }
  }
  const idx = localPendingMemories.findIndex((m) => Number(m.id) === targetId);
  if (idx !== -1) {
    return localPendingMemories.splice(idx, 1)[0];
  }
  return null;
}

// ============================================================
// RATE LIMITING COUNTERS (Shared with api/lib/rateLimit.ts)
// ============================================================

export async function checkAndIncrementRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const now = Math.floor(Date.now() / 1000);

  if (isKVConfigured()) {
    try {
      const count = await kv.incr(key);
      if (count === 1) {
        await kv.expire(key, windowSeconds);
      }
      const ttl = await kv.ttl(key);
      const remaining = Math.max(0, limit - count);
      return {
        allowed: count <= limit,
        remaining,
        reset: now + (ttl > 0 ? ttl : windowSeconds),
      };
    } catch (err) {
      console.warn('KV rate limit error, using memory fallback:', err);
    }
  }

  // Local fallback rate limiter
  const entry = localRateLimits.get(key);
  if (!entry || entry.resetAt <= now) {
    localRateLimits.set(key, { count: 1, resetAt: now + windowSeconds });
    return {
      allowed: true,
      remaining: limit - 1,
      reset: now + windowSeconds,
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  return {
    allowed: entry.count <= limit,
    remaining,
    reset: entry.resetAt,
  };
}
