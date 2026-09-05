import { Router } from 'express';
import { verifyAdmin } from '../lib/auth.ts';
import { getSiteContent, commitSiteContent } from '../lib/github.ts';
import { formatGDriveImageUrl, validateImageUrl } from '../lib/media.ts';

const router = Router();

// GET /teachers
router.get('/', async (_req, res) => {
  try {
    const content = await getSiteContent();
    const teachers = content.teachers || [];
    return res.status(200).json({ success: true, count: teachers.length, data: teachers });
  } catch (err: any) {
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

  const siteContent = await getSiteContent();
  siteContent.teachers = siteContent.teachers || [];

  const newTeacher = {
    id: Date.now(),
    name,
    department,
    photoUrl: normalizedPhoto,
    message,
    profileLink: profileLink || null,
    videoUrl: null,
    isFeatured: Boolean(isFeatured),
    status: 'published',
    displayOrder: siteContent.teachers.length + 1,
    createdAt: new Date().toISOString(),
  };

  siteContent.teachers.push(newTeacher);
  await commitSiteContent(siteContent, `Add teacher message: "${name}"`);

  return res.status(201).json({ success: true, data: newTeacher });
});

// PUT /teachers (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Teacher ID required' });

  const siteContent = await getSiteContent();
  const idx = (siteContent.teachers || []).findIndex((t: any) => Number(t.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Teacher not found' });

  const updateData = { ...req.body };
  if (updateData.photoUrl) {
    const val = validateImageUrl(updateData.photoUrl);
    if (!val.valid) return res.status(400).json({ error: val.message });
    updateData.photoUrl = formatGDriveImageUrl(updateData.photoUrl);
  }

  siteContent.teachers[idx] = { ...siteContent.teachers[idx], ...updateData, id };
  await commitSiteContent(siteContent, `Update teacher #${id} ("${siteContent.teachers[idx].name}")`);

  return res.status(200).json({ success: true, data: siteContent.teachers[idx] });
});

// DELETE /teachers (Admin auth required)
router.delete('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Teacher ID required' });

  const siteContent = await getSiteContent();
  siteContent.teachers = (siteContent.teachers || []).filter((t: any) => Number(t.id) !== id);

  await commitSiteContent(siteContent, `Delete teacher #${id}`);

  return res.status(200).json({ success: true });
});

export default router;
