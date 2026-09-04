import { Router, Response } from 'express';
import { memoryStore } from '../services/store.ts';
import { verifyAdminToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/memories - Public gets approved memories, Admin can filter by status (pending/approved/rejected)
router.get('/', (req, res) => {
  const statusFilter = (req.query.status as string) || 'approved';
  const memories = memoryStore.getMemories(statusFilter);
  res.json({ success: true, count: memories.length, data: memories });
});

// POST /api/memories - Public "Write a Memory" submission
router.post('/', (req, res) => {
  const { authorName, authorRole, message, imageUrl, category } = req.body;
  if (!authorName || !message) {
    return res.status(400).json({ error: 'Author name and memory message are required.' });
  }
  const submission = memoryStore.addMemory({
    authorName,
    authorRole: authorRole || 'Student',
    message,
    imageUrl,
    category: category || 'general',
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your memory submission has been received and will appear after admin review.',
    data: submission,
  });
});

// PUT /api/memories/:id/status - Admin moderation approval/rejection
router.put('/:id/status', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved, rejected, or pending.' });
  }

  const updated = memoryStore.updateMemoryStatus(id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Memory submission not found.' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/memories/:id - Admin delete submission
router.delete('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const success = memoryStore.deleteMemory(id);
  res.json({ success });
});

export default router;
