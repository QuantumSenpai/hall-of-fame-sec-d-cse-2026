import { Router, Response } from 'express';
import { memoryStore } from '../services/store.ts';
import { verifyAdminToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/videos - List of videos
router.get('/', (req, res) => {
  const chapterId = req.query.chapterId ? Number(req.query.chapterId) : undefined;
  const includeAll = req.query.admin === 'true';
  const videos = memoryStore.getVideos(chapterId, includeAll);
  res.json({ success: true, count: videos.length, data: videos });
});

// POST /api/videos - Admin add YouTube video
router.post('/', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const { title, description, youtubeUrl, chapterId, isFeatured, status } = req.body;
  if (!youtubeUrl) {
    return res.status(400).json({ error: 'YouTube URL is required.' });
  }
  const newVideo = memoryStore.addVideo({
    title: title || 'Untitled Video',
    description,
    youtubeUrl,
    chapterId: chapterId ? Number(chapterId) : undefined,
    isFeatured: Boolean(isFeatured),
    status: status || 'published',
  });
  res.status(201).json({ success: true, data: newVideo });
});

// PUT /api/videos/:id - Admin update video
router.put('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const updated = memoryStore.updateVideo(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Video not found.' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/videos/:id - Admin delete video
router.delete('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const success = memoryStore.deleteVideo(id);
  res.json({ success });
});

export default router;
