import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { verifyAdmin } from '../lib/auth.js';
import { getDb, schema } from '../db/index.js';

const router = Router();

// GET /hero
router.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const [heroData] = await db.select().from(schema.hero).limit(1);
    return res.status(200).json({ success: true, data: heroData || {} });
  } catch (err: any) {
    console.error('Error fetching hero from database:', err);
    return res.status(500).json({ error: 'Failed to fetch hero content', details: err.message });
  }
});

// PUT /hero (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  try {
    const db = getDb();
    const [existing] = await db.select().from(schema.hero).limit(1);

    const updateData: any = { ...req.body, updatedAt: new Date() };
    delete updateData.id;

    let updatedHero;
    if (existing) {
      [updatedHero] = await db
        .update(schema.hero)
        .set(updateData)
        .where(eq(schema.hero.id, existing.id))
        .returning();
    } else {
      [updatedHero] = await db.insert(schema.hero).values(updateData).returning();
    }

    return res.status(200).json({ success: true, data: updatedHero });
  } catch (err: any) {
    console.error('Error updating hero:', err);
    return res.status(500).json({ error: 'Failed to update hero content', details: err.message });
  }
});

export default router;
