import { checkLoginRateLimit } from '../lib/rateLimit.ts';
import { verifyCredentials, generateAdminToken, setAdminCookie } from '../lib/auth.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate Limiting (5 attempts per 15 minutes per IP)
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
}
