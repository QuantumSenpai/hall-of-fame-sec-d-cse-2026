import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { verifyAdmin } from '../lib/auth.js';
import { getDb, schema } from '../db/index.js';

const router = Router();

// GET /apology
router.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const [apologyData] = await db.select().from(schema.apology).limit(1);
    return res.status(200).json({ success: true, data: apologyData || {} });
  } catch (err: any) {
    console.error('Error fetching apology from database:', err);
    return res.status(500).json({ error: 'Failed to fetch apology content', details: err.message });
  }
});

// PUT /apology (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  try {
    const db = getDb();
    const [existing] = await db.select().from(schema.apology).limit(1);

    const updateData: any = { ...req.body, updatedAt: new Date() };
    delete updateData.id;

    if (typeof updateData.paragraphs === 'string') {
      updateData.paragraphs = updateData.paragraphs
        .split('\n\n')
        .map((p: string) => p.trim())
        .filter(Boolean);
    }

    let updatedApology;
    if (existing) {
      [updatedApology] = await db
        .update(schema.apology)
        .set(updateData)
        .where(eq(schema.apology.id, existing.id))
        .returning();
    } else {
      [updatedApology] = await db.insert(schema.apology).values(updateData).returning();
    }

    return res.status(200).json({ success: true, data: updatedApology });
  } catch (err: any) {
    console.error('Error updating apology:', err);
    return res.status(500).json({ error: 'Failed to update apology content', details: err.message });
  }
});

export default router;
