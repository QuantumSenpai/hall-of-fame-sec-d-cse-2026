/**
 * GET /api/content
 * 
 * Strategy Selection for Content Freshness (Fix #3):
 * Option (a) was chosen: This endpoint fetches the latest site-content.json directly
 * from GitHub's Raw Content API via getSiteContent() (with a short 30s cache to avoid GitHub rate limits),
 * ensuring newly committed admin changes reflect without waiting for Vercel rebuild cycles.
 * In addition, live photo like counts from Vercel KV are merged into each photo item (Fix #1),
 * ensuring real-time likes without modifying site-content.json.
 */

import { getSiteContent } from './lib/github.ts';
import { getAllPhotoLikes } from './lib/kv.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const content = await getSiteContent();

    // Fix #1: Merge real-time KV likes into photos array
    const photoIds = (content.photos || []).map((p: any) => Number(p.id));
    const kvLikes = await getAllPhotoLikes(photoIds);

    const mergedPhotos = (content.photos || []).map((p: any) => ({
      ...p,
      likes: kvLikes[p.id] !== undefined ? kvLikes[p.id] : p.likes || 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        ...content,
        photos: mergedPhotos,
      },
    });
  } catch (err: any) {
    console.error('Error fetching site content:', err);
    return res.status(500).json({ error: 'Failed to load site content', details: err.message });
  }
}
