import { verifyAdmin } from '../../lib/auth.ts';
import { removePendingMemory } from '../../lib/kv.ts';
import { getSiteContent, commitSiteContent } from '../../lib/github.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin authentication check
  const admin = verifyAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const idRaw = req.query?.id || req.params?.id;
  const memoryId = Number(idRaw);
  const { status } = req.body || {};

  if (!memoryId || !['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Valid memory ID and status (approved/rejected/pending) required.' });
  }

  try {
    // 1. Check if memory is currently in KV pending queue
    const pendingItem = await removePendingMemory(memoryId);

    const siteContent = await getSiteContent();
    siteContent.memories = siteContent.memories || [];

    if (status === 'approved') {
      if (pendingItem) {
        // Append approved item from KV to site-content.json
        const approvedItem = {
          ...pendingItem,
          status: 'approved',
          approvedAt: new Date().toISOString(),
        };
        siteContent.memories.push(approvedItem);
      } else {
        // Memory might already be in site-content.json (re-approving or status toggle)
        const existing = siteContent.memories.find((m: any) => Number(m.id) === memoryId);
        if (existing) {
          existing.status = 'approved';
        } else {
          return res.status(404).json({ error: 'Memory submission not found in queue or site content.' });
        }
      }

      // Commit update to GitHub
      const commitRes = await commitSiteContent(
        siteContent,
        `Approve student memory #${memoryId} from ${pendingItem?.authorName || 'student'}`
      );

      return res.status(200).json({
        success: true,
        message: 'Memory approved and published.',
        commit: commitRes,
      });
    }

    if (status === 'rejected') {
      // Memory removed from KV. If present in site-content, filter it out or mark rejected
      siteContent.memories = siteContent.memories.filter((m: any) => Number(m.id) !== memoryId);

      const commitRes = await commitSiteContent(
        siteContent,
        `Reject/Remove memory #${memoryId}`
      );

      return res.status(200).json({
        success: true,
        message: 'Memory rejected and removed.',
        commit: commitRes,
      });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Moderation error:', err);
    return res.status(500).json({ error: 'Moderation action failed', details: err.message });
  }
}
