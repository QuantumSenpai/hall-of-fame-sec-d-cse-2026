import { Router } from 'express';
import { verifyAdmin } from '../lib/auth.ts';
import { getSiteContent, commitSiteContent } from '../lib/github.ts';
import { extractYouTubeId, getYouTubeThumbnail } from '../lib/media.ts';

const router = Router();

// GET /videos
router.get('/', async (_req, res) => {
  try {
    const content = await getSiteContent();
    const videos = content.videos || [];
    return res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch videos', details: err.message });
  }
});

// POST /videos (Admin auth required)
router.post('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const { title, description, youtubeUrl, isFeatured } = req.body || {};

  const rawInput = youtubeUrl || req.body?.youtubeId || req.body?.url;
  if (!title || !rawInput) {
    return res.status(400).json({ error: 'Video title and youtubeUrl (or ID) are required.' });
  }

  const { videoId, isShort } = extractYouTubeId(rawInput);
  if (!videoId) {
    return res.status(400).json({
      error: 'Invalid YouTube URL or ID. Please provide a valid YouTube video link, shorts link, or 11-character video ID.',
    });
  }

  const thumbnailUrl = getYouTubeThumbnail(videoId);
  const canonicalYoutubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const siteContent = await getSiteContent();
  siteContent.videos = siteContent.videos || [];

  const newVideo = {
    id: Date.now(),
    title,
    description: description || null,
    youtubeUrl: canonicalYoutubeUrl,
    youtubeId: videoId,
    thumbnailUrl,
    isShort,
    isFeatured: Boolean(isFeatured),
    displayOrder: siteContent.videos.length + 1,
    createdAt: new Date().toISOString(),
  };

  siteContent.videos.push(newVideo);
  await commitSiteContent(siteContent, `Add video: "${title}"`);

  return res.status(201).json({ success: true, data: newVideo });
});

// PUT /videos (Admin auth required)
router.put('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Video ID required' });

  const siteContent = await getSiteContent();
  const idx = (siteContent.videos || []).findIndex((v: any) => Number(v.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Video not found' });

  const existing = siteContent.videos[idx];
  const updateData = { ...req.body };

  if (updateData.youtubeUrl && updateData.youtubeUrl !== existing.youtubeUrl) {
    const { videoId, isShort } = extractYouTubeId(updateData.youtubeUrl);
    if (videoId) {
      updateData.youtubeId = videoId;
      updateData.thumbnailUrl = getYouTubeThumbnail(videoId);
      updateData.isShort = isShort;
    }
  }

  siteContent.videos[idx] = { ...existing, ...updateData, id };
  await commitSiteContent(siteContent, `Update video #${id} ("${siteContent.videos[idx].title}")`);

  return res.status(200).json({ success: true, data: siteContent.videos[idx] });
});

// DELETE /videos (Admin auth required)
router.delete('/', async (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const id = Number(req.query?.id || req.body?.id);
  if (!id) return res.status(400).json({ error: 'Video ID required' });

  const siteContent = await getSiteContent();
  siteContent.videos = (siteContent.videos || []).filter((v: any) => Number(v.id) !== id);

  await commitSiteContent(siteContent, `Delete video #${id}`);

  return res.status(200).json({ success: true });
});

export default router;
