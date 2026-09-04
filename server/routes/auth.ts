import { Router, Response } from 'express';
import { generateToken, verifyAdminToken, AuthRequest } from '../middleware/auth.ts';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'teachersday2026';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = generateToken(username, 'admin');
    return res.json({
      success: true,
      token,
      user: { username, role: 'admin' },
    });
  }

  return res.status(401).json({ error: 'Invalid admin credentials.' });
});

// GET /api/auth/me
router.get('/me', verifyAdminToken, (req: AuthRequest, res: Response) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
});

export default router;
