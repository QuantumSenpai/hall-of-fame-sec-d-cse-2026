import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '../db/index.js';
import { getAllPhotoLikes } from '../lib/kv.js';

const router = Router();

// GET /content — Unified site content fetched directly from PostgreSQL
router.get('/', async (_req, res) => {
  try {
    const db = getDb();

    const [
      heroList,
      photosList,
      videosList,
      teachersList,
      peopleList,
      memoriesList,
      apologyList,
    ] = await Promise.all([
      db.select().from(schema.hero).limit(1),
      db.select().from(schema.photos),
      db.select().from(schema.videos),
      db.select().from(schema.teachers),
      db.select().from(schema.people),
      db.select().from(schema.memories).where(eq(schema.memories.status, 'approved')),
      db.select().from(schema.apology).limit(1),
    ]);

    // Sort lists by displayOrder asc, then id asc
    photosList.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.id - b.id);
    videosList.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.id - b.id);
    teachersList.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.id - b.id);
    peopleList.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.id - b.id);

    // Merge real-time KV likes into photos array
    const photoIds = photosList.map((p: any) => Number(p.id));
    const kvLikes = await getAllPhotoLikes(photoIds);

    const mergedPhotos = photosList.map((p: any) => ({
      ...p,
      likes: kvLikes[p.id] !== undefined ? kvLikes[p.id] : p.likes || 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        hero: heroList[0] || {},
        photos: mergedPhotos,
        videos: videosList,
        teachers: teachersList,
        people: peopleList,
        memories: memoriesList,
        apology: apologyList[0] || {},
      },
    });
  } catch (err: any) {
    console.error('Error loading unified site content from database:', err);
    return res.status(500).json({ error: 'Failed to load site content', details: err.message });
  }
});

export default router;
