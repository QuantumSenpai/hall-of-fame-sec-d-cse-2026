/**
 * Media utility functions: Google Drive image normalization & YouTube video handling
 */

/**
 * Extracts Google Drive file ID from standard share links, view links, or direct IDs.
 */
export function extractGDriveFileId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // Check if string itself is an ID (25+ chars of letters, digits, hyphen, underscore)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }

  // Common Google Drive URL patterns
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /open\?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Normalizes Google Drive link into high-res direct image URL.
 * Strictly disallows Google Photos share links as they cannot be hotlinked.
 */
export function formatGDriveImageUrl(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();

  // Guard against Google Photos share links which break when hotlinked
  if (trimmed.includes('photos.app.goo.gl') || trimmed.includes('photos.google.com/share')) {
    console.warn('Google Photos share links do not support hotlinking. Please use Google Drive direct links.');
    return trimmed;
  }

  const fileId = extractGDriveFileId(trimmed);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
  }
  return trimmed;
}

/**
 * Validates whether an image URL is acceptable (not a broken Google Photos share link)
 */
export function validateImageUrl(url: string): { valid: boolean; message?: string } {
  if (!url) return { valid: false, message: 'Image URL is required' };
  if (url.includes('photos.app.goo.gl') || url.includes('photos.google.com/share')) {
    return {
      valid: false,
      message: 'Google Photos share links cannot be hotlinked. Please share via Google Drive or direct image URL.',
    };
  }
  return { valid: true };
}

/**
 * Extracts YouTube Video ID from watch links, shorts, or embed links
 */
export function extractYouTubeId(url: string): { videoId: string | null; isShort: boolean } {
  if (!url) return { videoId: null, isShort: false };
  const trimmed = url.trim();

  let isShort = false;
  let videoId: string | null = null;

  // Shorts format: youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return { videoId: shortsMatch[1], isShort: true };
  }

  // Standard watch / embed / tu.be format
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /v=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  // Check if string itself is an 11-char ID
  if (!videoId && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    videoId = trimmed;
  }

  return { videoId, isShort };
}

/**
 * Gets high-quality YouTube thumbnail URL without needing an API key
 */
export function getYouTubeThumbnail(videoId: string): string {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
