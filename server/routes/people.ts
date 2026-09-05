import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { verifyAdmin } from '../lib/auth.js';
import { getDb, schema } from '../db/index.js';
import { formatGDriveImageUrl } from '../lib/media.js';

const router = Router();

// GET /people
router.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const peopleList = await db.select().from(schema.people);
    peopleList.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.id - b.id);
    return res.status(200).json({ success: true, count: peopleList.length, data: peopleList });
  } catch (err: any) {
    console.error('Error fetching people from database:', err);
    return res.status(500).json({ error: 'Failed to fetch people', details: err.message });
  }
});

// POST /people (Admin auth required)
router.post('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const { name, role, team, photoUrl, bio } = req.body || {};

  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required.' });
  }

  try {
    const db = getDb();
    const existing = await db.select().from(schema.people);
    const maxOrder = existing.reduce((max: number, p: any) => Math.max(max, p.displayOrder || 0), 0);

    const [newPerson] = await db
      .insert(schema.people)
      .values({
        name,
        role,
        team: team || 'organizer',
        photoUrl: photoUrl ? formatGDriveImageUrl(photoUrl) : null,
        bio: bio || null,
        displayOrder: maxOrder + 1,
      })
      .returning();

    return res.status(201).json({ success: true, data: newPerson });
  } catch (err: any) {
    console.error('Error inserting person:', err);
    return res.status(500).json({ error: 'Failed to create person record', details: err.message });
  }
});

// PUT /people (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Person ID required' });

  try {
    const db = getDb();
    const [existing] = await db.select().from(schema.people).where(eq(schema.people.id, id));
    if (!existing) return res.status(404).json({ error: 'Person not found' });

    const updateData: any = { ...req.body };
    delete updateData.id;

    if (updateData.photoUrl) {
      updateData.photoUrl = formatGDriveImageUrl(updateData.photoUrl);
    }

    const [updated] = await db
      .update(schema.people)
      .set(updateData)
      .where(eq(schema.people.id, id))
      .returning();

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    console.error('Error updating person:', err);
    return res.status(500).json({ error: 'Failed to update person record', details: err.message });
  }
});

// DELETE /people (Admin auth required)
router.delete('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Person ID required' });

  try {
    const db = getDb();
    await db.delete(schema.people).where(eq(schema.people.id, id));
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error deleting person:', err);
    return res.status(500).json({ error: 'Failed to delete person record', details: err.message });
  }
});

export default router;
