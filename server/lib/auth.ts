import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as cookie from 'cookie';
import type { IncomingMessage, ServerResponse } from 'http';

export interface AdminPayload {
  username: string;
  role: string;
}

/**
 * Validates and retrieves the JWT signing secret from the environment.
 * Throws a critical error if missing — NEVER silently falls back to a hardcoded string.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error(
      'CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing. Refusing to run with insecure auth defaults.'
    );
  }
  return secret;
}

/**
 * Validates and retrieves the Admin configuration from the environment.
 * Throws a critical error if neither password nor hash is configured.
 */
export function getAdminCredentials(): {
  username: string;
  password?: string;
  passwordHash?: string;
} {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const password = process.env.ADMIN_PASSWORD;

  const hasPassword = Boolean(password && password.trim() !== '');
  const hasHash = Boolean(passwordHash && passwordHash.trim() !== '');

  if (!hasPassword && !hasHash) {
    throw new Error(
      'CRITICAL SECURITY ERROR: Neither ADMIN_PASSWORD nor ADMIN_PASSWORD_HASH environment variable is configured. Refusing to start or authenticate with fallback credentials.'
    );
  }

  return {
    username,
    password: hasPassword ? password : undefined,
    passwordHash: hasHash ? passwordHash : undefined,
  };
}

/**
 * Startup assertion helper to verify all critical auth environment variables
 */
export function validateAuthEnvironment(): void {
  getJwtSecret();
  getAdminCredentials();
}

/**
 * Validates admin credentials against ADMIN_PASSWORD_HASH (bcrypt) or ADMIN_PASSWORD.
 * Throws if auth environment is unconfigured.
 */
export function verifyCredentials(username: string, password: string): Promise<boolean> {
  const creds = getAdminCredentials();
  if (!username || !password) return Promise.resolve(false);
  if (username !== creds.username) return Promise.resolve(false);

  // 1. Bcrypt hash check (recommended for production)
  if (creds.passwordHash) {
    try {
      return bcrypt.compare(password, creds.passwordHash);
    } catch {
      return Promise.resolve(false);
    }
  }

  // 2. Direct string comparison (fallback to ADMIN_PASSWORD only)
  if (creds.password) {
    return Promise.resolve(password === creds.password);
  }

  return Promise.resolve(false);
}

/**
 * Signs an admin JWT token using the validated JWT_SECRET
 */
export function generateAdminToken(username: string): string {
  const secret = getJwtSecret();
  return jwt.sign({ username, role: 'admin' }, secret, { expiresIn: '7d' });
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
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as AdminPayload;
    if (decoded && decoded.role === 'admin') {
      return decoded;
    }
  } catch {
    return null;
  }
  return null;
}
