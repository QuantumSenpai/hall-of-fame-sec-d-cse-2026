import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as cookie from 'cookie';
import type { IncomingMessage, ServerResponse } from 'http';

const JWT_SECRET = process.env.JWT_SECRET || 'teachers_day_2026_super_secret_jwt_key_fallback';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'teachersday2026';

export interface AdminPayload {
  username: string;
  role: string;
}

/**
 * Validates admin credentials against ADMIN_PASSWORD_HASH or default fallback password
 */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) return false;

  if (ADMIN_PASSWORD_HASH) {
    try {
      return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } catch {
      return false;
    }
  }

  // Fallback direct check or generate hash on the fly
  return password === DEFAULT_PASSWORD;
}

/**
 * Signs an admin JWT token
 */
export function generateAdminToken(username: string): string {
  return jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Sets the httpOnly, Secure, SameSite=Strict admin cookie on the response
 */
export function setAdminCookie(res: ServerResponse | any, token: string): void {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const serialized = cookie.serialize('admin_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  res.setHeader('Set-Cookie', serialized);
}

/**
 * Clears the admin cookie
 */
export function clearAdminCookie(res: ServerResponse | any): void {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const serialized = cookie.serialize('admin_token', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  res.setHeader('Set-Cookie', serialized);
}

/**
 * Verifies admin JWT extracted from request cookies (or authorization header fallback)
 */
export function verifyAdmin(req: IncomingMessage | any): AdminPayload | null {
  const cookieHeader = req.headers?.cookie || '';
  const parsedCookies = cookie.parse(cookieHeader);
  const token = parsedCookies.admin_token;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    if (decoded && decoded.role === 'admin') {
      return decoded;
    }
  } catch {
    return null;
  }
  return null;
}
