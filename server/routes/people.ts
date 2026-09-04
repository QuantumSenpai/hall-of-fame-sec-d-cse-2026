import { Router, Response } from 'express';
import { memoryStore } from '../services/store.ts';
import { verifyAdminToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/people - List organizers & contributors
router.get('/', (req, res) => {
  const people = memoryStore.getPeople();
  res.json({ success: true, count: people.length, data: people });
});

// POST /api/people - Admin add contributor
router.post('/', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const { name, role, team, photoUrl, bio } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required.' });
  }
  const newPerson = memoryStore.addPerson({
    name,
    role,
    team: team || 'organizer',
    photoUrl,
    bio,
  });
  res.status(201).json({ success: true, data: newPerson });
});

// DELETE /api/people/:id - Admin delete contributor
router.delete('/:id', verifyAdminToken, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const success = memoryStore.deletePerson(id);
  res.json({ success });
});

export default router;
