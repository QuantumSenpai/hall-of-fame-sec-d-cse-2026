import { Router } from 'express';
import { getSiteContent } from '../lib/github.js';
import { getAllPhotoLikes } from '../lib/kv.js';

const router = Router();

// GET /content
router.get('/', async (_req, res) => {
  try {
    const content = await getSiteContent();

    // Merge real-time KV likes into photos array
    const photoIds = (content.photos || []).map((p: any) => Number(p.id));
    const kvLikes = await getAllPhotoLikes(photoIds);

    const mergedPhotos = (content.photos || []).map((p: any) => ({
      ...p,
      likes: kvLikes[p.id] !== undefined ? kvLikes[p.id] : p.likes || 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        ...content,
        photos: mergedPhotos,
      },
    });
  } catch (err: any) {
    console.error('Error fetching site content:', err);
    return res.status(500).json({ error: 'Failed to load site content', details: err.message });
  }
});

export default router;
