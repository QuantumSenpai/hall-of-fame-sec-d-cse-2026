import { clearAdminCookie } from '../lib/auth.ts';

export default async function handler(req: any, res: any) {
  clearAdminCookie(res);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
