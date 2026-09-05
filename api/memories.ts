import { checkMemorySubmitRateLimit } from './lib/rateLimit.ts';
import { pushPendingMemory, getPendingMemories } from './lib/kv.ts';
import { getSiteContent } from './lib/github.ts';
import { verifyAdmin } from './lib/auth.ts';

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

export default async function handler(req: any, res: any) {
  // GET /api/memories
  if (req.method === 'GET') {
    const status = req.query?.status || 'approved';

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
  }

  // POST /api/memories — Public submission queued in KV
  if (req.method === 'POST') {
    // Fix #2: Rate Limit (3 submissions per 10 minutes per IP)
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
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
