import type { HeroContent, Photo, Video, Teacher, StudentMemory, Person, ApologyContent } from '../types/index.ts';

const API_BASE = '/api';

export interface SiteContentResponse {
  hero: HeroContent;
  photos: Photo[];
  videos: Video[];
  teachers: Teacher[];
  memories: StudentMemory[];
  people: Person[];
  apology: ApologyContent;
}

/**
 * Fetches the unified site content payload.
 */
export async function fetchSiteContent(): Promise<SiteContentResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/content`, { credentials: 'include' });
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn('API connection offline, using client fallback');
    return null;
  }
}

export async function fetchHero(): Promise<HeroContent | null> {
  try {
    const res = await fetch(`${API_BASE}/hero`, { credentials: 'include' });
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function updateHero(data: Partial<HeroContent>) {
  const res = await fetch(`${API_BASE}/hero`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchApology(): Promise<ApologyContent | null> {
  try {
    const res = await fetch(`${API_BASE}/apology`, { credentials: 'include' });
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function updateApology(data: Partial<ApologyContent>) {
  const res = await fetch(`${API_BASE}/apology`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchPhotos(category?: string, admin = false): Promise<Photo[]> {
  try {
    const query = new URLSearchParams();
    if (category && category.toUpperCase() !== 'ALL') query.append('category', category);
    if (admin) query.append('admin', 'true');
    const res = await fetch(`${API_BASE}/photos?${query.toString()}`, { credentials: 'include' });
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function likePhoto(id: number): Promise<{ success: boolean; likes?: number }> {
  try {
    const res = await fetch(`${API_BASE}/photos/${id}/like`, {
      method: 'POST',
      credentials: 'include',
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchVideos(admin = false): Promise<Video[]> {
  try {
    const query = new URLSearchParams();
    if (admin) query.append('admin', 'true');
    const res = await fetch(`${API_BASE}/videos?${query.toString()}`, { credentials: 'include' });
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function fetchTeachers(admin = false): Promise<Teacher[]> {
  try {
    const res = await fetch(`${API_BASE}/teachers${admin ? '?admin=true' : ''}`, { credentials: 'include' });
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function fetchMemories(status = 'approved'): Promise<StudentMemory[]> {
  try {
    const res = await fetch(`${API_BASE}/memories?status=${status}`, { credentials: 'include' });
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function submitMemory(data: {
  authorName: string;
  authorRole?: string;
  message: string;
  imageUrl?: string;
  category?: string;
}) {
  const res = await fetch(`${API_BASE}/memories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateMemoryStatus(id: number, status: 'approved' | 'rejected' | 'pending') {
  const res = await fetch(`${API_BASE}/memories/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchPeople(): Promise<Person[]> {
  try {
    const res = await fetch(`${API_BASE}/people`, { credentials: 'include' });
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

// ============================================================
// ADMIN CMS MUTATORS (All use httpOnly cookie via credentials: 'include')
// ============================================================

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function adminCheckAuth() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
    return await res.json();
  } catch {
    return { authenticated: false };
  }
}

export async function adminLogout() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
}

export async function adminAddPhoto(data: Partial<Photo>) {
  const res = await fetch(`${API_BASE}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminUpdatePhoto(id: number, data: Partial<Photo>) {
  const res = await fetch(`${API_BASE}/photos?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeletePhoto(id: number) {
  const res = await fetch(`${API_BASE}/photos?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}

export async function adminAddVideo(data: Partial<Video>) {
  const res = await fetch(`${API_BASE}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminUpdateVideo(id: number, data: Partial<Video>) {
  const res = await fetch(`${API_BASE}/videos?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteVideo(id: number) {
  const res = await fetch(`${API_BASE}/videos?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}

export async function adminAddTeacher(data: Partial<Teacher>) {
  const res = await fetch(`${API_BASE}/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteTeacher(id: number) {
  const res = await fetch(`${API_BASE}/teachers?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}

export async function adminAddPerson(data: Partial<Person>) {
  const res = await fetch(`${API_BASE}/people`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminUpdatePerson(id: number, data: Partial<Person>) {
  const res = await fetch(`${API_BASE}/people?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeletePerson(id: number) {
  const res = await fetch(`${API_BASE}/people?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}
