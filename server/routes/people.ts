import { Router } from 'express';
import { verifyAdmin } from '../lib/auth.ts';
import { getSiteContent, commitSiteContent } from '../lib/github.ts';
import { formatGDriveImageUrl } from '../lib/media.ts';

const router = Router();

// GET /people
router.get('/', async (_req, res) => {
  try {
    const content = await getSiteContent();
    const people = content.people || [];
    return res.status(200).json({ success: true, count: people.length, data: people });
  } catch (err: any) {
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

  const siteContent = await getSiteContent();
  siteContent.people = siteContent.people || [];

  const newPerson = {
    id: Date.now(),
    name,
    role,
    team: team || 'organizer',
    photoUrl: photoUrl ? formatGDriveImageUrl(photoUrl) : null,
    bio: bio || null,
    displayOrder: siteContent.people.length + 1,
    createdAt: new Date().toISOString(),
  };

  siteContent.people.push(newPerson);
  await commitSiteContent(siteContent, `Add contributor: "${name}"`);

  return res.status(201).json({ success: true, data: newPerson });
});

// PUT /people (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Person ID required' });

  const siteContent = await getSiteContent();
  const idx = (siteContent.people || []).findIndex((p: any) => Number(p.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Person not found' });

  const existing = siteContent.people[idx];
  const updateData = { ...req.body };
  if (updateData.photoUrl) {
    updateData.photoUrl = formatGDriveImageUrl(updateData.photoUrl);
  }

  siteContent.people[idx] = { ...existing, ...updateData, id };
  await commitSiteContent(siteContent, `Update contributor #${id} ("${siteContent.people[idx].name}")`);

  return res.status(200).json({ success: true, data: siteContent.people[idx] });
});

// DELETE /people (Admin auth required)
router.delete('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Person ID required' });

  const siteContent = await getSiteContent();
  siteContent.people = (siteContent.people || []).filter((p: any) => Number(p.id) !== id);

  await commitSiteContent(siteContent, `Delete contributor #${id}`);

  return res.status(200).json({ success: true });
});

export default router;
