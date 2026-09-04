/**
 * Google Drive & YouTube URL Parser Utilities
 */

/**
 * Extracts Google Drive file ID from standard share links, view links, or direct IDs.
 */
export function extractGDriveFileId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  
  // If it's already just an ID (e.g. 1a2b3c4d5e...)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(urlOrId.trim())) {
    return urlOrId.trim();
  }

  // Regex patterns for various Google Drive URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /open\?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Normalizes Google Drive link into direct image URL
 */
export function formatGDriveImageUrl(urlOrId: string): string {
  const fileId = extractGDriveFileId(urlOrId);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
  }
  return urlOrId;
}

/**
 * Extracts YouTube Video ID from watch links, shorts, or embed links
 */
export function extractYouTubeId(url: string): { videoId: string | null; isShort: boolean } {
  if (!url) return { videoId: null, isShort: false };

  let isShort = false;
  let videoId: string | null = null;

  // Shorts format: youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return { videoId: shortsMatch[1], isShort: true };
  }

  // Standard watch / embed / tu.be format
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /v=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  // Check if string itself is an 11-char ID
  if (!videoId && /^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    videoId = url.trim();
  }

  return { videoId, isShort };
}

/**
 * Gets high-quality YouTube thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
