import { Router } from 'express';
import { checkLoginRateLimit } from '../lib/rateLimit.ts';
import { verifyCredentials, generateAdminToken, setAdminCookie, clearAdminCookie, verifyAdmin } from '../lib/auth.ts';

const router = Router();

// POST /login (Rate Limiting: 5 attempts per 15 minutes per IP)
router.post('/login', async (req, res) => {
  const rate = await checkLoginRateLimit(req);
  if (!rate.allowed) {
    return res.status(429).json({
      error: 'Too many login attempts. Please try again in 15 minutes.',
      resetInSeconds: rate.reset - Math.floor(Date.now() / 1000),
    });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const isValid = await verifyCredentials(username, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = generateAdminToken(username);
    setAdminCookie(res, token);

    // Security essential: Return user info WITHOUT the JWT token in response body
    return res.status(200).json({
      success: true,
      user: {
        username,
        role: 'admin',
      },
    });
  } catch (err: any) {
    console.error('CRITICAL AUTH CONFIG ERROR:', err.message);
    return res.status(500).json({
      error: 'Authentication is disabled: required server credentials (ADMIN_PASSWORD or JWT_SECRET) are unconfigured.',
    });
  }
});

// GET /me
router.get('/me', (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({
    authenticated: true,
    user: admin,
  });
});

// POST /logout
router.post('/logout', (_req, res) => {
  clearAdminCookie(res);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export default router;
