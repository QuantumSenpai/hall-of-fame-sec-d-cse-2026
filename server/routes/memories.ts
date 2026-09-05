import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { verifyAdmin } from '../lib/auth.js';
import { getDb, schema } from '../db/index.js';
import { checkMemorySubmitRateLimit } from '../lib/rateLimit.js';
import { pushPendingMemory, getPendingMemories, removePendingMemory } from '../lib/kv.js';

const router = Router();

function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .trim();
}

// PUT /memories/:id/status (Admin approval / rejection)
router.put('/:id/status', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const idRaw = req.params?.id || req.query?.id;
  const memoryId = Number(idRaw);
  const { status } = req.body || {};

  if (!memoryId || !['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Valid memory ID and status (approved/rejected/pending) required.' });
  }

  try {
    const db = getDb();
    const pendingItem = await removePendingMemory(memoryId);

    if (status === 'approved') {
      if (pendingItem) {
        // Insert approved memory from KV into Postgres
        const [saved] = await db
          .insert(schema.memories)
          .values({
            authorName: pendingItem.authorName,
            authorRole: pendingItem.authorRole || 'Student',
            message: pendingItem.message,
            imageUrl: pendingItem.imageUrl || null,
            category: pendingItem.category || 'gratitude',
            status: 'approved',
            isFeatured: false,
            approvedAt: Date.now(),
          })
          .returning();

        return res.status(200).json({
          success: true,
          message: 'Memory approved and published to database.',
          data: saved,
        });
      } else {
        // Toggle status of existing database record
        const [existing] = await db.select().from(schema.memories).where(eq(schema.memories.id, memoryId));
        if (!existing) {
          return res.status(404).json({ error: 'Memory submission not found in queue or database.' });
        }

        const [updated] = await db
          .update(schema.memories)
          .set({ status: 'approved', approvedAt: Date.now() })
          .where(eq(schema.memories.id, memoryId))
          .returning();

        return res.status(200).json({
          success: true,
          message: 'Memory status updated to approved.',
          data: updated,
        });
      }
    }

    if (status === 'rejected') {
      // Remove from database if present
      await db.delete(schema.memories).where(eq(schema.memories.id, memoryId));
      return res.status(200).json({
        success: true,
        message: 'Memory rejected and removed.',
      });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Moderation error:', err);
    return res.status(500).json({ error: 'Moderation action failed', details: err.message });
  }
});

// GET /memories
router.get('/', async (req, res) => {
  const status = (req.query?.status as string) || 'approved';

  if (status === 'pending') {
    const admin = verifyAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized. Admin session required to view pending queue.' });
    }
    const pendingList = await getPendingMemories();
    return res.status(200).json({ success: true, count: pendingList.length, data: pendingList });
  }

  // Fetch approved memories from Postgres
  try {
    const db = getDb();
    const approved = await db
      .select()
      .from(schema.memories)
      .where(eq(schema.memories.status, 'approved'));

    return res.status(200).json({ success: true, count: approved.length, data: approved });
  } catch (err: any) {
    console.error('Error fetching memories from database:', err);
    return res.status(500).json({ error: 'Failed to fetch memories', details: err.message });
  }
});

// POST /memories (Public submission queued in KV)
router.post('/', async (req, res) => {
  const rate = await checkMemorySubmitRateLimit(req);
  if (!rate.allowed) {
    return res.status(429).json({
      error: 'Too many submissions from your connection. Please wait a few minutes before submitting another memory.',
      resetInSeconds: rate.reset - Math.floor(Date.now() / 1000),
    });
  }

  const { authorName, authorRole, message, imageUrl, category } = req.body || {};

  if (!authorName || !message) {
    return res.status(400).json({ error: 'Author name and memory message are required.' });
  }

  const cleanAuthor = sanitizeInput(authorName);
  const cleanRole = sanitizeInput(authorRole || 'Student');
  const cleanMessage = sanitizeInput(message);
  const cleanCategory = sanitizeInput(category || 'gratitude');
  const cleanImage = imageUrl ? sanitizeInput(imageUrl) : null;

  if (cleanMessage.length < 5) {
    return res.status(400).json({ error: 'Memory message must be at least 5 characters long.' });
  }

  const submission = {
    id: Date.now(),
    authorName: cleanAuthor,
    authorRole: cleanRole,
    message: cleanMessage,
    imageUrl: cleanImage,
    category: cleanCategory,
    status: 'pending',
    isFeatured: false,
    createdAt: new Date().toISOString(),
  };

  await pushPendingMemory(submission);

  return res.status(201).json({
    success: true,
    message: 'Thank you! Your memory submission has been received and will appear after admin review.',
    data: submission,
  });
});

export default router;
