import { Router } from 'express';
import { verifyAdmin } from '../lib/auth.ts';
import { getSiteContent, commitSiteContent } from '../lib/github.ts';

const router = Router();

// GET /apology
router.get('/', async (_req, res) => {
  try {
    const content = await getSiteContent();
    return res.status(200).json({ success: true, data: content.apology || {} });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch apology content', details: err.message });
  }
});

// PUT /apology (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  try {
    const siteContent = await getSiteContent();
    const updatedApology = {
      ...siteContent.apology,
      ...req.body,
    };

    // Ensure paragraphs is an array if provided as text or array
    if (typeof updatedApology.paragraphs === 'string') {
      updatedApology.paragraphs = (updatedApology.paragraphs as string)
        .split('\n\n')
        .map((p: string) => p.trim())
        .filter(Boolean);
    }

    siteContent.apology = updatedApology;
    await commitSiteContent(siteContent, 'Update Thank You & Apology section content');

    return res.status(200).json({ success: true, data: updatedApology });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update apology content', details: err.message });
  }
});

export default router;
