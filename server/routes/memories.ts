import { Router } from 'express';
import { verifyAdmin } from '../lib/auth.ts';
import { getSiteContent, commitSiteContent } from '../lib/github.ts';
import { checkMemorySubmitRateLimit } from '../lib/rateLimit.ts';
import { pushPendingMemory, getPendingMemories, removePendingMemory } from '../lib/kv.ts';

const router = Router();

/**
 * Sanitizes user input string against XSS by removing HTML tags
 */
function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/<[^>]*>?/gm, '') // Strip all HTML tags
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
    // 1. Check if memory is currently in KV pending queue
    const pendingItem = await removePendingMemory(memoryId);

    const siteContent = await getSiteContent();
    siteContent.memories = siteContent.memories || [];

    if (status === 'approved') {
      if (pendingItem) {
        // Append approved item from KV to site-content.json
        const approvedItem = {
          ...pendingItem,
          status: 'approved',
          approvedAt: new Date().toISOString(),
        };
        siteContent.memories.push(approvedItem);
      } else {
        // Memory might already be in site-content.json (re-approving or status toggle)
        const existing = siteContent.memories.find((m: any) => Number(m.id) === memoryId);
        if (existing) {
          existing.status = 'approved';
        } else {
          return res.status(404).json({ error: 'Memory submission not found in queue or site content.' });
        }
      }

      // Commit update to GitHub
      const commitRes = await commitSiteContent(
        siteContent,
        `Approve student memory #${memoryId} from ${pendingItem?.authorName || 'student'}`
      );

      return res.status(200).json({
        success: true,
        message: 'Memory approved and published.',
        commit: commitRes,
      });
    }

    if (status === 'rejected') {
      // Memory removed from KV. If present in site-content, filter it out or mark rejected
      siteContent.memories = siteContent.memories.filter((m: any) => Number(m.id) !== memoryId);

      const commitRes = await commitSiteContent(
        siteContent,
        `Reject/Remove memory #${memoryId}`
      );

      return res.status(200).json({
        success: true,
        message: 'Memory rejected and removed.',
        commit: commitRes,
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

  // Return approved memories from site content
  try {
    const content = await getSiteContent();
    const approved = (content.memories || []).filter((m: any) => m.status === 'approved');
    return res.status(200).json({ success: true, count: approved.length, data: approved });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch memories', details: err.message });
  }
});

// POST /memories (Public submission queued in KV)
router.post('/', async (req, res) => {
  // Rate Limit: 3 submissions per 10 minutes per IP
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

  // Security: Sanitize all fields to prevent stored XSS
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

  // Store in Vercel KV queue until admin approval
  await pushPendingMemory(submission);

  return res.status(201).json({
    success: true,
    message: 'Thank you! Your memory submission has been received and will appear after admin review.',
    data: submission,
  });
});

export default router;
