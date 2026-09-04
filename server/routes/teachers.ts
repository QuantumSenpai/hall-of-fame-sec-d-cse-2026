import { Router, Response } from 'express';
import { memoryStore } from '../services/store.ts';
import { verifyAdminToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/teachers - List teachers & messages
router.get('/', (req, res) => {
  const includeAll = req.query.admin === 'true';
  const teachers = memoryStore.getTeachers(includeAll);
  res.json({ success: true, count: teachers.length, data: teachers });
});

// POST /api/teachers - Admin add teacher
router.post('/', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const { name, department, photoUrl, message, profileLink, videoUrl, isFeatured, status } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Teacher name and message are required.' });
  }
  const newTeacher = memoryStore.addTeacher({
    name,
    department: department || 'Computer Science & Engineering',
    photoUrl,
    message,
    profileLink,
    videoUrl,
    isFeatured: Boolean(isFeatured),
    status: status || 'published',
  });
  res.status(201).json({ success: true, data: newTeacher });
});

// PUT /api/teachers/:id - Admin update teacher
router.put('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const updated = memoryStore.updateTeacher(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Teacher not found.' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/teachers/:id - Admin delete teacher
router.delete('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const success = memoryStore.deleteTeacher(id);
  res.json({ success });
});

export default router;
