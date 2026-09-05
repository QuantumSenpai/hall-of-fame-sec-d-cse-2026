import { verifyAdmin } from './lib/auth.ts';
import { getSiteContent, commitSiteContent } from './lib/github.ts';

export default async function handler(req: any, res: any) {
  // GET /api/hero
  if (req.method === 'GET') {
    try {
      const content = await getSiteContent();
      return res.status(200).json({ success: true, data: content.hero || {} });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch hero content', details: err.message });
    }
  }

  // Admin authentication check
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  // PUT /api/hero
  if (req.method === 'PUT') {
    try {
      const siteContent = await getSiteContent();
      const updatedHero = {
        ...siteContent.hero,
        ...req.body,
      };

      siteContent.hero = updatedHero;
      await commitSiteContent(siteContent, 'Update Hero section content');

      return res.status(200).json({ success: true, data: updatedHero });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update hero content', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
