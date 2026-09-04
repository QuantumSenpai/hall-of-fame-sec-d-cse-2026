import { Router, Response } from 'express';
import { memoryStore } from '../services/store.ts';
import { verifyAdminToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/chapters - Public list of published chapters
router.get('/', (req, res) => {
  const includeAll = req.query.admin === 'true';
  const chapters = memoryStore.getChapters(includeAll);
  res.json({ success: true, count: chapters.length, data: chapters });
});

// POST /api/chapters - Admin create chapter
router.post('/', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const { title, subtitle, description, chapterNumber, layoutType, coverImageUrl, status } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Chapter title is required.' });
  }
  const newChapter = memoryStore.addChapter({
    title,
    subtitle,
    description,
    chapterNumber: Number(chapterNumber) || undefined,
    layoutType,
    coverImageUrl,
    status,
  });
  res.status(201).json({ success: true, data: newChapter });
});

// PUT /api/chapters/:id - Admin update chapter
router.put('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const updated = memoryStore.updateChapter(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Chapter not found.' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/chapters/:id - Admin delete chapter
router.delete('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const success = memoryStore.deleteChapter(id);
  res.json({ success });
});

export default router;
