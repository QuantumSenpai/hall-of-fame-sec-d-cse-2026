import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'teachers_day_2026_super_secret_jwt_key';

export interface AuthRequest extends Request {
  user?: {
    username: string;
    role: string;
  };
}

export function generateToken(username: string, role = 'admin'): string {
  return jwt.sign({ username, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden. Invalid or expired token.' });
  }
}
