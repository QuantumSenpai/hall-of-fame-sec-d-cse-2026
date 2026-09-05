import { verifyAdmin } from './lib/auth.ts';
import { getSiteContent, commitSiteContent } from './lib/github.ts';
import { formatGDriveImageUrl, validateImageUrl, extractGDriveFileId } from './lib/media.ts';
import { getAllPhotoLikes } from './lib/kv.ts';

export default async function handler(req: any, res: any) {
  // GET /api/photos
  if (req.method === 'GET') {
    try {
      const content = await getSiteContent();
      let photos = content.photos || [];

      const category = (req.query?.category as string) || '';
      const isAdmin = req.query?.admin === 'true';

      if (category && category.toUpperCase() !== 'ALL') {
        photos = photos.filter((p: any) => p.category?.toUpperCase() === category.toUpperCase());
      }

      if (!isAdmin) {
        photos = photos.filter((p: any) => p.status !== 'archived');
      }

      // Merge real-time KV likes
      const photoIds = photos.map((p: any) => Number(p.id));
      const kvLikes = await getAllPhotoLikes(photoIds);
      const merged = photos.map((p: any) => ({
        ...p,
        likes: kvLikes[p.id] !== undefined ? kvLikes[p.id] : p.likes || 0,
      }));

      return res.status(200).json({ success: true, count: merged.length, data: merged });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch photos', details: err.message });
    }
  }

  // Admin authentication check for write endpoints
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  // POST /api/photos — Add photo
  if (req.method === 'POST') {
    const { title, imageUrl, caption, description, category, layoutStyle, isFeatured, date, location } = req.body || {};

    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Photo title and imageUrl are required.' });
    }

    const validation = validateImageUrl(imageUrl);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const normalizedUrl = formatGDriveImageUrl(imageUrl);
    const driveId = extractGDriveFileId(imageUrl);

    const siteContent = await getSiteContent();
    siteContent.photos = siteContent.photos || [];

    const newPhoto = {
      id: Date.now(),
      title,
      caption: caption || null,
      description: description || null,
      imageUrl: normalizedUrl,
      driveFileId: driveId,
      layoutStyle: layoutStyle || 'vintage_frame',
      category: category || 'MEMORIES',
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      location: location || null,
      uploadedBy: 'Admin',
      likes: 0,
      isFeatured: Boolean(isFeatured),
      status: 'published',
      displayOrder: siteContent.photos.length + 1,
      createdAt: new Date().toISOString(),
    };

    siteContent.photos.push(newPhoto);

    await commitSiteContent(siteContent, `Add photo: "${title}"`);

    return res.status(201).json({ success: true, data: newPhoto });
  }

  // PUT /api/photos — Update photo
  if (req.method === 'PUT') {
    const id = Number(req.query?.id || req.body?.id);
    if (!id) return res.status(400).json({ error: 'Photo ID required' });

    const siteContent = await getSiteContent();
    const idx = (siteContent.photos || []).findIndex((p: any) => Number(p.id) === id);
    if (idx === -1) return res.status(404).json({ error: 'Photo not found' });

    const existing = siteContent.photos[idx];
    const updateData = { ...req.body };

    if (updateData.imageUrl) {
      const validation = validateImageUrl(updateData.imageUrl);
      if (!validation.valid) return res.status(400).json({ error: validation.message });
      updateData.imageUrl = formatGDriveImageUrl(updateData.imageUrl);
      updateData.driveFileId = extractGDriveFileId(updateData.imageUrl);
    }

    siteContent.photos[idx] = { ...existing, ...updateData, id };

    await commitSiteContent(siteContent, `Update photo #${id} ("${siteContent.photos[idx].title}")`);

    return res.status(200).json({ success: true, data: siteContent.photos[idx] });
  }

  // DELETE /api/photos
  if (req.method === 'DELETE') {
    const id = Number(req.query?.id || req.body?.id);
    if (!id) return res.status(400).json({ error: 'Photo ID required' });

    const siteContent = await getSiteContent();
    siteContent.photos = (siteContent.photos || []).filter((p: any) => Number(p.id) !== id);

    await commitSiteContent(siteContent, `Delete photo #${id}`);

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
