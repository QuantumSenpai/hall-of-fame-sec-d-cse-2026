import { verifyAdmin } from './lib/auth.ts';
import { getSiteContent, commitSiteContent } from './lib/github.ts';

export default async function handler(req: any, res: any) {
  // GET /api/apology
  if (req.method === 'GET') {
    try {
      const content = await getSiteContent();
      return res.status(200).json({ success: true, data: content.apology || {} });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch apology content', details: err.message });
    }
  }

  // Admin authentication check
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  // PUT /api/apology
  if (req.method === 'PUT') {
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
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
