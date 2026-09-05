import { Router } from 'express';
import { eq, desc, and, ne } from 'drizzle-orm';
import { verifyAdmin } from '../lib/auth.js';
import { getDb, schema } from '../db/index.js';
import { formatGDriveImageUrl, validateImageUrl, extractGDriveFileId } from '../lib/media.js';
import { getAllPhotoLikes, incrementPhotoLikes } from '../lib/kv.js';
import { checkPhotoLikeRateLimit } from '../lib/rateLimit.js';

const router = Router();

// POST /photos/:id/like (Atomic KV likes counter)
router.post('/:id/like', async (req, res) => {
  const rate = await checkPhotoLikeRateLimit(req);
  if (!rate.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded: Too many likes in a short window. Please wait a moment.',
      resetInSeconds: rate.reset - Math.floor(Date.now() / 1000),
    });
  }

  const idRaw = req.params?.id || req.query?.id || req.body?.id;
  const photoId = Number(idRaw);

  if (!photoId || isNaN(photoId)) {
    return res.status(400).json({ error: 'Valid photo ID is required' });
  }

  const newLikes = await incrementPhotoLikes(photoId);

  return res.status(200).json({
    success: true,
    photoId,
    likes: newLikes,
  });
});

// GET /photos
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    let query = db.select().from(schema.photos);

    const category = (req.query?.category as string) || '';
    const isAdmin = req.query?.admin === 'true';

    let photosList = await query;

    if (category && category.toUpperCase() !== 'ALL') {
      photosList = photosList.filter((p: any) => p.category?.toUpperCase() === category.toUpperCase());
    }

    if (!isAdmin) {
      photosList = photosList.filter((p: any) => p.status !== 'archived');
    }

    // Sort by displayOrder asc, then id asc
    photosList.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.id - b.id);

    // Merge real-time KV likes
    const photoIds = photosList.map((p: any) => Number(p.id));
    const kvLikes = await getAllPhotoLikes(photoIds);
    const merged = photosList.map((p: any) => ({
      ...p,
      likes: kvLikes[p.id] !== undefined ? kvLikes[p.id] : p.likes || 0,
    }));

    return res.status(200).json({ success: true, count: merged.length, data: merged });
  } catch (err: any) {
    console.error('Error fetching photos from database:', err);
    return res.status(500).json({ error: 'Failed to fetch photos', details: err.message });
  }
});

// POST /photos (Add photo - Admin auth required)
router.post('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const { title, imageUrl, caption, description, category, layoutStyle, isFeatured, date, location } = req.body || {};

  if (!title || !imageUrl) {
    return res.status(400).json({ error: 'Photo title and imageUrl are required.' });
  }

  const validation = validateImageUrl(imageUrl);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const normalizedUrl = formatGDriveImageUrl(imageUrl);
  const driveId = extractGDriveFileId(imageUrl);

  try {
    const db = getDb();
    const existing = await db.select().from(schema.photos);
    const maxOrder = existing.reduce((max: number, p: any) => Math.max(max, p.displayOrder || 0), 0);

    const [newPhoto] = await db
      .insert(schema.photos)
      .values({
        title,
        caption: caption || null,
        description: description || null,
        imageUrl: normalizedUrl,
        driveFileId: driveId,
        layoutStyle: layoutStyle || 'vintage_frame',
        category: category || 'MEMORIES',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        location: location || null,
        uploadedBy: 'Admin',
        likes: 0,
        isFeatured: Boolean(isFeatured),
        status: 'published',
        displayOrder: maxOrder + 1,
      })
      .returning();

    return res.status(201).json({ success: true, data: newPhoto });
  } catch (err: any) {
    console.error('Error inserting photo:', err);
    return res.status(500).json({ error: 'Failed to create photo record', details: err.message });
  }
});

// PUT /photos (Update photo - Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Photo ID required' });

  try {
    const db = getDb();
    const [existing] = await db.select().from(schema.photos).where(eq(schema.photos.id, id));
    if (!existing) return res.status(404).json({ error: 'Photo not found' });

    const updateData: any = { ...req.body };
    delete updateData.id;

    if (updateData.imageUrl) {
      const validation = validateImageUrl(updateData.imageUrl);
      if (!validation.valid) return res.status(400).json({ error: validation.message });
      updateData.imageUrl = formatGDriveImageUrl(updateData.imageUrl);
      updateData.driveFileId = extractGDriveFileId(updateData.imageUrl);
    }

    const [updated] = await db
      .update(schema.photos)
      .set(updateData)
      .where(eq(schema.photos.id, id))
      .returning();

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    console.error('Error updating photo:', err);
    return res.status(500).json({ error: 'Failed to update photo record', details: err.message });
  }
});

// DELETE /photos (Admin auth required)
router.delete('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Photo ID required' });

  try {
    const db = getDb();
    await db.delete(schema.photos).where(eq(schema.photos.id, id));
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error deleting photo:', err);
    return res.status(500).json({ error: 'Failed to delete photo record', details: err.message });
  }
});

export default router;
