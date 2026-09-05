import { Router } from 'express';
import { verifyAdmin } from '../lib/auth.js';
import { getSiteContent, commitSiteContent } from '../lib/github.js';

const router = Router();

// GET /hero
router.get('/', async (_req, res) => {
  try {
    const content = await getSiteContent();
    return res.status(200).json({ success: true, data: content.hero || {} });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch hero content', details: err.message });
  }
});

// PUT /hero (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

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
});

export default router;
