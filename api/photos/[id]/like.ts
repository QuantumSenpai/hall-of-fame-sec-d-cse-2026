import { checkPhotoLikeRateLimit } from '../../lib/rateLimit.ts';
import { incrementPhotoLikes } from '../../lib/kv.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate Limiting (20 likes per minute per IP)
  const rate = await checkPhotoLikeRateLimit(req);
  if (!rate.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded: Too many likes in a short window. Please wait a moment.',
      resetInSeconds: rate.reset - Math.floor(Date.now() / 1000),
    });
  }

  // Extract ID from path params or query or body
  const idRaw = req.query?.id || req.params?.id || req.body?.id;
  const photoId = Number(idRaw);

  if (!photoId || isNaN(photoId)) {
    return res.status(400).json({ error: 'Valid photo ID is required' });
  }

  // Fix #1: Increments in Vercel KV ONLY. Under no circumstances reads/writes content/site-content.json
  const newLikes = await incrementPhotoLikes(photoId);

  return res.status(200).json({
    success: true,
    photoId,
    likes: newLikes,
  });
}
