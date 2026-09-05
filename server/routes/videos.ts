import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { verifyAdmin } from '../lib/auth.js';
import { getDb, schema } from '../db/index.js';
import { extractYouTubeId, getYouTubeThumbnail } from '../lib/media.js';

const router = Router();

// GET /videos
router.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const videosList = await db.select().from(schema.videos);
    videosList.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.id - b.id);
    return res.status(200).json({ success: true, count: videosList.length, data: videosList });
  } catch (err: any) {
    console.error('Error fetching videos from database:', err);
    return res.status(500).json({ error: 'Failed to fetch videos', details: err.message });
  }
});

// POST /videos (Admin auth required)
router.post('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const { title, description, youtubeUrl, isFeatured } = req.body || {};

  const rawInput = youtubeUrl || req.body?.youtubeId || req.body?.url;
  if (!title || !rawInput) {
    return res.status(400).json({ error: 'Video title and youtubeUrl (or ID) are required.' });
  }

  const { videoId, isShort } = extractYouTubeId(rawInput);
  if (!videoId) {
    return res.status(400).json({
      error: 'Invalid YouTube URL or ID. Please provide a valid YouTube video link, shorts link, or 11-character video ID.',
    });
  }

  const thumbnailUrl = getYouTubeThumbnail(videoId);
  const canonicalYoutubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const db = getDb();
    const existing = await db.select().from(schema.videos);
    const maxOrder = existing.reduce((max: number, v: any) => Math.max(max, v.displayOrder || 0), 0);

    const [newVideo] = await db
      .insert(schema.videos)
      .values({
        title,
        description: description || null,
        youtubeUrl: canonicalYoutubeUrl,
        youtubeId: videoId,
        thumbnailUrl,
        isShort,
        isFeatured: Boolean(isFeatured),
        status: 'published',
        displayOrder: maxOrder + 1,
      })
      .returning();

    return res.status(201).json({ success: true, data: newVideo });
  } catch (err: any) {
    console.error('Error inserting video:', err);
    return res.status(500).json({ error: 'Failed to create video record', details: err.message });
  }
});

// PUT /videos (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Video ID required' });

  try {
    const db = getDb();
    const [existing] = await db.select().from(schema.videos).where(eq(schema.videos.id, id));
    if (!existing) return res.status(404).json({ error: 'Video not found' });

    const updateData: any = { ...req.body };
    delete updateData.id;

    if (updateData.youtubeUrl && updateData.youtubeUrl !== existing.youtubeUrl) {
      const { videoId, isShort } = extractYouTubeId(updateData.youtubeUrl);
      if (videoId) {
        updateData.youtubeId = videoId;
        updateData.thumbnailUrl = getYouTubeThumbnail(videoId);
        updateData.isShort = isShort;
      }
    }

    const [updated] = await db
      .update(schema.videos)
      .set(updateData)
      .where(eq(schema.videos.id, id))
      .returning();

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    console.error('Error updating video:', err);
    return res.status(500).json({ error: 'Failed to update video record', details: err.message });
  }
});

// DELETE /videos (Admin auth required)
router.delete('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Video ID required' });

  try {
    const db = getDb();
    await db.delete(schema.videos).where(eq(schema.videos.id, id));
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error deleting video:', err);
    return res.status(500).json({ error: 'Failed to delete video record', details: err.message });
  }
});

export default router;
