export interface Chapter {
  id: number;
  chapterNumber: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  layoutType: 'editorial' | 'polaroid_stack' | 'video_theater' | 'torn_collage' | 'film_strip' | string;
  coverImageUrl?: string | null;
  status: 'draft' | 'published' | 'archived' | string;
  displayOrder: number;
  createdAt: string | Date;
}

export interface Photo {
  id: number;
  chapterId?: number | null;
  title: string;
  caption?: string | null;
  description?: string | null;
  imageUrl: string;
  driveFileId?: string | null;
  layoutStyle: 'polaroid' | 'torn_edge' | 'vintage_frame' | 'full_bleed' | string;
  category?: string | null;
  date?: string | null;
  location?: string | null;
  uploadedBy?: string | null;
  likes?: number;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived' | string;
  displayOrder: number;
  createdAt: string | Date;
}

export interface Video {
  id: number;
  chapterId?: number | null;
  title: string;
  description?: string | null;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl?: string | null;
  isShort: boolean;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived' | string;
  displayOrder: number;
  createdAt: string | Date;
}

export interface Teacher {
  id: number;
  name: string;
  department: string;
  photoUrl?: string | null;
  message: string;
  profileLink?: string | null;
  videoUrl?: string | null;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived' | string;
  displayOrder: number;
  createdAt: string | Date;
}

export interface StudentMemory {
  id: number;
  authorName: string;
  authorRole: string;
  message: string;
  imageUrl?: string | null;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  isFeatured: boolean;
  createdAt: string | Date;
}

export interface ExternalLink {
  id: number;
  title: string;
  description?: string | null;
  platform: 'instagram' | 'youtube' | 'gdrive' | 'linkedin' | 'facebook' | 'other' | string;
  url: string;
  thumbnailUrl?: string | null;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string | Date;
}

export interface Person {
  id: number;
  name: string;
  role: string;
  team: 'lead' | 'media' | 'organizer' | 'volunteer' | string;
  photoUrl?: string | null;
  bio?: string | null;
  displayOrder: number;
  createdAt: string | Date;
}
