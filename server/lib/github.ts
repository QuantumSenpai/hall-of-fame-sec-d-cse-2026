import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface SiteContent {
  hero: any;
  photos: any[];
  videos: any[];
  teachers: any[];
  people: any[];
  apology: any;
  memories: any[];
}

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'QuantumSenpai';
const GITHUB_REPO = process.env.GITHUB_REPO || 'hall-of-fame-sec-d-cse-2026';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const CONTENT_FILE_PATH = 'content/site-content.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cache for raw content to avoid rate limit spikes on GitHub raw API
let rawContentCache: { data: SiteContent; timestamp: number } | null = null;
const RAW_CACHE_TTL_MS = 30 * 1000; // 30 seconds

/**
 * Reads site content.
 * On Vercel: fetches freshest data from GitHub Raw Content API (with short in-memory cache) or falls back to local read if available.
 * In Local Dev: reads directly from local filesystem content/site-content.json.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const isVercel = Boolean(process.env.VERCEL);

  if (isVercel) {
    const now = Date.now();
    if (rawContentCache && now - rawContentCache.timestamp < RAW_CACHE_TTL_MS) {
      return rawContentCache.data;
    }

    try {
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${CONTENT_FILE_PATH}?t=${now}`;
      const headers: Record<string, string> = {
        'User-Agent': 'Teachers-Day-Memory-Book-API',
      };
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      const res = await fetch(rawUrl, { headers });
      if (res.ok) {
        const data = (await res.json()) as SiteContent;
        rawContentCache = { data, timestamp: now };
        return data;
      }
    } catch (err) {
      console.warn('Failed to fetch raw GitHub content, falling back to local file read:', err);
    }
  }

  // Local filesystem read
  try {
    const localPath = path.resolve(process.cwd(), CONTENT_FILE_PATH);
    if (fs.existsSync(localPath)) {
      const raw = await fs.promises.readFile(localPath, 'utf-8');
      const data = JSON.parse(raw) as SiteContent;
      rawContentCache = { data, timestamp: Date.now() };
      return data;
    }
    // Fallback relative to __dirname
    const fallbackPath = path.resolve(__dirname, '../../content/site-content.json');
    if (fs.existsSync(fallbackPath)) {
      const raw = await fs.promises.readFile(fallbackPath, 'utf-8');
      const data = JSON.parse(raw) as SiteContent;
      rawContentCache = { data, timestamp: Date.now() };
      return data;
    }
    throw new Error(`Could not find ${CONTENT_FILE_PATH} in cwd or relative to module`);
  } catch (err) {
    throw err;
  }
}

/**
 * Commits updated site content.
 * In Production on Vercel: commits via GitHub REST Contents API to trigger auto-redeploy.
 * Guard: If on Vercel and GITHUB_TOKEN is missing, throws an explicit descriptive error.
 * In Local Dev: writes directly to disk.
 */
export async function commitSiteContent(
  updatedContent: SiteContent,
  commitMessage: string
): Promise<{ success: boolean; commitSha?: string; source: 'github' | 'local' }> {
  const isVercel = Boolean(process.env.VERCEL);
  const token = process.env.GITHUB_TOKEN;

  // Local FS Fallback Guard
  if (isVercel) {
    if (!token) {
      throw new Error('GITHUB_TOKEN missing in production environment');
    }

    // 1. Fetch current file SHA from GitHub Contents API
    const contentsUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_FILE_PATH}`;
    const getRes = await fetch(contentsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Teachers-Day-Memory-Book-API',
      },
    });

    if (!getRes.ok) {
      const errText = await getRes.text();
      throw new Error(`Failed to retrieve file SHA from GitHub: ${getRes.status} ${errText}`);
    }

    const { sha } = (await getRes.json()) as { sha: string };

    // 2. Commit update via PUT
    const formattedJson = JSON.stringify(updatedContent, null, 2);
    const contentBase64 = Buffer.from(formattedJson, 'utf-8').toString('base64');

    const putRes = await fetch(contentsUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Teachers-Day-Memory-Book-API',
      },
      body: JSON.stringify({
        message: commitMessage || 'Update content/site-content.json via Admin CMS',
        content: contentBase64,
        sha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`GitHub Contents API commit failed: ${putRes.status} ${errText}`);
    }

    const putData = (await putRes.json()) as any;
    // Bust in-memory cache so next call sees fresh data immediately
    rawContentCache = { data: updatedContent, timestamp: Date.now() };

    return {
      success: true,
      commitSha: putData.commit?.sha,
      source: 'github',
    };
  }

  // Local Development: Safe local filesystem write
  const localPath = path.resolve(process.cwd(), CONTENT_FILE_PATH);
  await fs.promises.writeFile(localPath, JSON.stringify(updatedContent, null, 2), 'utf-8');
  rawContentCache = { data: updatedContent, timestamp: Date.now() };

  return {
    success: true,
    source: 'local',
  };
}
