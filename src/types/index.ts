export interface HeroContent {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  subtitle: string;
  bookImage: string;
  bookCaption: string;
  quoteHeading: string;
  quoteSubtext: string;
}

export interface Photo {
  id: number;
  title: string;
  caption?: string | null;
  imageUrl: string;
  category?: string | null;
  likes?: number;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Video {
  id: number;
  title: string;
  description?: string | null;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl?: string | null;
  isFeatured: boolean;
  displayOrder?: number;
  createdAt?: string;
}

export interface Teacher {
  id: number;
  name: string;
  department: string;
  photoUrl?: string | null;
  message: string;
  profileLink?: string | null;
  isFeatured: boolean;
  displayOrder: number;
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
  createdAt: string;
}

export interface Person {
  id: number;
  name: string;
  role: string;
  photoUrl?: string | null;
  bio?: string | null;
  displayOrder: number;
}

export interface ApologyContent {
  label: string;
  title: string;
  paragraphs: string[];
  signature: string;
  subSignature: string;
}
