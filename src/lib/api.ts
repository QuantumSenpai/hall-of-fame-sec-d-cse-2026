import { Chapter, Photo, Video, Teacher, StudentMemory, ExternalLink, Person } from '../types/index.ts';

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchChapters(admin = false): Promise<Chapter[]> {
  try {
    const res = await fetch(`${API_BASE}/chapters${admin ? '?admin=true' : ''}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('API connection offline, using memory store fallback');
    return [];
  }
}

export async function fetchPhotos(category?: string, chapterId?: number, admin = false): Promise<Photo[]> {
  try {
    const query = new URLSearchParams();
    if (category && category.toUpperCase() !== 'ALL') query.append('category', category);
    if (chapterId) query.append('chapterId', String(chapterId));
    if (admin) query.append('admin', 'true');
    const res = await fetch(`${API_BASE}/photos?${query.toString()}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function likePhoto(id: number): Promise<{ success: boolean; likes?: number; data?: Photo }> {
  try {
    const res = await fetch(`${API_BASE}/photos/${id}/like`, { method: 'POST' });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchVideos(chapterId?: number, admin = false): Promise<Video[]> {
  try {
    const query = new URLSearchParams();
    if (chapterId) query.append('chapterId', String(chapterId));
    if (admin) query.append('admin', 'true');
    const res = await fetch(`${API_BASE}/videos?${query.toString()}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function fetchTeachers(admin = false): Promise<Teacher[]> {
  try {
    const res = await fetch(`${API_BASE}/teachers${admin ? '?admin=true' : ''}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function fetchMemories(status = 'approved'): Promise<StudentMemory[]> {
  try {
    const res = await fetch(`${API_BASE}/memories?status=${status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function submitMemory(data: { authorName: string; authorRole?: string; message: string; imageUrl?: string; category?: string }) {
  const res = await fetch(`${API_BASE}/memories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateMemoryStatus(id: number, status: 'approved' | 'rejected' | 'pending') {
  const res = await fetch(`${API_BASE}/memories/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchExternalLinks(): Promise<ExternalLink[]> {
  try {
    const res = await fetch(`${API_BASE}/links`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function fetchPeople(): Promise<Person[]> {
  try {
    const res = await fetch(`${API_BASE}/people`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

// Admin API Mutators
export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json();
  if (json.token) {
    localStorage.setItem('admin_token', json.token);
  }
  return json;
}

export async function adminAddPhoto(data: Partial<Photo>) {
  const res = await fetch(`${API_BASE}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminUpdatePhoto(id: number, data: Partial<Photo>) {
  const res = await fetch(`${API_BASE}/photos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeletePhoto(id: number) {
  const res = await fetch(`${API_BASE}/photos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function adminAddVideo(data: Partial<Video>) {
  const res = await fetch(`${API_BASE}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteVideo(id: number) {
  const res = await fetch(`${API_BASE}/videos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function adminAddTeacher(data: Partial<Teacher>) {
  const res = await fetch(`${API_BASE}/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteTeacher(id: number) {
  const res = await fetch(`${API_BASE}/teachers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function adminAddChapter(data: Partial<Chapter>) {
  const res = await fetch(`${API_BASE}/chapters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteChapter(id: number) {
  const res = await fetch(`${API_BASE}/chapters/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function adminAddLink(data: Partial<ExternalLink>) {
  const res = await fetch(`${API_BASE}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteLink(id: number) {
  const res = await fetch(`${API_BASE}/links/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}
