import { Router, Response } from 'express';
import { memoryStore } from '../services/store.ts';
import { verifyAdminToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/photos - Public list of photos
router.get('/', (req, res) => {
  const chapterId = req.query.chapterId ? Number(req.query.chapterId) : undefined;
  const includeAll = req.query.admin === 'true';
  const photos = memoryStore.getPhotos(chapterId, includeAll);
  res.json({ success: true, count: photos.length, data: photos });
});

// POST /api/photos - Admin add photo
router.post('/', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const { title, caption, imageUrl, chapterId, layoutStyle, isFeatured, status } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL or Drive link is required.' });
  }
  const newPhoto = memoryStore.addPhoto({
    title: title || 'Untitled Photo',
    caption,
    imageUrl,
    chapterId: chapterId ? Number(chapterId) : undefined,
    layoutStyle: layoutStyle || 'polaroid',
    isFeatured: Boolean(isFeatured),
    status: status || 'published',
  });
  res.status(201).json({ success: true, data: newPhoto });
});

// PUT /api/photos/:id - Admin update photo
router.put('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const updated = memoryStore.updatePhoto(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Photo not found.' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/photos/:id - Admin delete photo
router.delete('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const success = memoryStore.deletePhoto(id);
  res.json({ success });
});

export default router;
