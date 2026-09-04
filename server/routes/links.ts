import { Router, Response } from 'express';
import { memoryStore } from '../services/store.ts';
import { verifyAdminToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/links - Public external links
router.get('/', (req, res) => {
  const links = memoryStore.getLinks();
  res.json({ success: true, count: links.length, data: links });
});

// POST /api/links - Admin create link
router.post('/', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const { title, description, platform, url, thumbnailUrl, isFeatured } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required.' });
  }
  const newLink = memoryStore.addLink({
    title,
    description,
    platform: platform || 'other',
    url,
    thumbnailUrl,
    isFeatured: Boolean(isFeatured),
  });
  res.status(201).json({ success: true, data: newLink });
});

// DELETE /api/links/:id - Admin delete link
router.delete('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const success = memoryStore.deleteLink(id);
  res.json({ success });
});

export default router;
