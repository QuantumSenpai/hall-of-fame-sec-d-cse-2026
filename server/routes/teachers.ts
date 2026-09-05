import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { verifyAdmin } from '../lib/auth.js';
import { getDb, schema } from '../db/index.js';
import { formatGDriveImageUrl, validateImageUrl } from '../lib/media.js';

const router = Router();

// GET /teachers
router.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const teachersList = await db.select().from(schema.teachers);
    teachersList.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.id - b.id);
    return res.status(200).json({ success: true, count: teachersList.length, data: teachersList });
  } catch (err: any) {
    console.error('Error fetching teachers from database:', err);
    return res.status(500).json({ error: 'Failed to fetch teachers', details: err.message });
  }
});

// POST /teachers (Admin auth required)
router.post('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const { name, department, photoUrl, message, profileLink, isFeatured } = req.body || {};

  if (!name || !department || !message) {
    return res.status(400).json({ error: 'Teacher name, department, and message are required.' });
  }

  let normalizedPhoto = photoUrl || null;
  if (photoUrl) {
    const val = validateImageUrl(photoUrl);
    if (!val.valid) return res.status(400).json({ error: val.message });
    normalizedPhoto = formatGDriveImageUrl(photoUrl);
  }

  try {
    const db = getDb();
    const existing = await db.select().from(schema.teachers);
    const maxOrder = existing.reduce((max: number, t: any) => Math.max(max, t.displayOrder || 0), 0);

    const [newTeacher] = await db
      .insert(schema.teachers)
      .values({
        name,
        department,
        photoUrl: normalizedPhoto,
        message,
        profileLink: profileLink || null,
        videoUrl: null,
        isFeatured: Boolean(isFeatured),
        status: 'published',
        displayOrder: maxOrder + 1,
      })
      .returning();

    return res.status(201).json({ success: true, data: newTeacher });
  } catch (err: any) {
    console.error('Error inserting teacher:', err);
    return res.status(500).json({ error: 'Failed to create teacher record', details: err.message });
  }
});

// PUT /teachers (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Teacher ID required' });

  try {
    const db = getDb();
    const [existing] = await db.select().from(schema.teachers).where(eq(schema.teachers.id, id));
    if (!existing) return res.status(404).json({ error: 'Teacher not found' });

    const updateData: any = { ...req.body };
    delete updateData.id;

    if (updateData.photoUrl) {
      const val = validateImageUrl(updateData.photoUrl);
      if (!val.valid) return res.status(400).json({ error: val.message });
      updateData.photoUrl = formatGDriveImageUrl(updateData.photoUrl);
    }

    const [updated] = await db
      .update(schema.teachers)
      .set(updateData)
      .where(eq(schema.teachers.id, id))
      .returning();

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    console.error('Error updating teacher:', err);
    return res.status(500).json({ error: 'Failed to update teacher record', details: err.message });
  }
});

// DELETE /teachers (Admin auth required)
router.delete('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Teacher ID required' });

  try {
    const db = getDb();
    await db.delete(schema.teachers).where(eq(schema.teachers.id, id));
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error deleting teacher:', err);
    return res.status(500).json({ error: 'Failed to delete teacher record', details: err.message });
  }
});

export default router;
