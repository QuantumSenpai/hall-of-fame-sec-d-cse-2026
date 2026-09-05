import type { IncomingMessage } from 'http';
import { checkAndIncrementRateLimit } from './kv.js';

/**
 * Extracts client IP from incoming request headers
 */
export function getClientIp(req: IncomingMessage | any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Rate limit: Admin login (5 attempts per 15 minutes per IP)
 */
export async function checkLoginRateLimit(req: any): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const ip = getClientIp(req);
  const key = `ratelimit:login:${ip}`;
  return checkAndIncrementRateLimit(key, 5, 15 * 60);
}

/**
 * Rate limit: Public memory submissions (3 submissions per 10 minutes per IP)
 */
export async function checkMemorySubmitRateLimit(req: any): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const ip = getClientIp(req);
  const key = `ratelimit:memory:${ip}`;
  return checkAndIncrementRateLimit(key, 3, 10 * 60);
}

/**
 * Rate limit: Photo likes (20 likes per 1 minute per IP)
 */
export async function checkPhotoLikeRateLimit(req: any): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const ip = getClientIp(req);
  const key = `ratelimit:like:${ip}`;
  return checkAndIncrementRateLimit(key, 20, 60);
}
