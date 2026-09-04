import { Chapter, Photo, Video, Teacher, StudentMemory, ExternalLink, Person } from '../db/schema.ts';
import { formatGDriveImageUrl, extractYouTubeId, getYouTubeThumbnail } from './media.ts';

// Initial Seed Data for Instant Out-of-the-Box Demo Experience

export const initialChapters: Chapter[] = [
  {
    id: 1,
    chapterNumber: 1,
    title: "THE BEGINNING",
    subtitle: "Morning whispers and rising excitement",
    description: "The sun rose on Teachers' Day 2026 as students gathered early in the auditorium, arranging fresh flowers, hanging golden ribbons, and preparing to honor our guiding lights.",
    layoutType: "editorial",
    coverImageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    displayOrder: 1,
    createdAt: new Date("2026-09-04T08:00:00Z"),
  },
  {
    id: 2,
    chapterNumber: 2,
    title: "A CELEBRATION OF GRATITUDE",
    subtitle: "Honoring those who shape our futures",
    description: "A ceremonial lamp lighting marked the commencement of the event, followed by warm welcoming addresses that set an emotional, deeply respectful tone for the afternoon.",
    layoutType: "polaroid_stack",
    coverImageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    displayOrder: 2,
    createdAt: new Date("2026-09-04T09:30:00Z"),
  },
  {
    id: 3,
    chapterNumber: 3,
    title: "MOMENTS OF JOY",
    subtitle: "Laughter, cake, and melody",
    description: "The grand cake-cutting ceremony was filled with applause, followed by surprise musical acts prepared by CSE Sec-D students that brought smiles to every professor's face.",
    layoutType: "torn_collage",
    coverImageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    displayOrder: 3,
    createdAt: new Date("2026-09-04T11:00:00Z"),
  },
  {
    id: 4,
    chapterNumber: 4,
    title: "WITH LOVE, FROM US",
    subtitle: "Tokens of endless appreciation",
    description: "Customized hand-drawn portraits, customized mementos, and personalized memory journals were handed over to our respected faculty members.",
    layoutType: "editorial",
    coverImageUrl: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    displayOrder: 4,
    createdAt: new Date("2026-09-04T12:15:00Z"),
  },
  {
    id: 5,
    chapterNumber: 5,
    title: "THROUGH OUR LENS",
    subtitle: "Unscripted smiles & candid warmth",
    description: "Photographs captured off-guard: shared jokes in the hallway, interactive fun games, and candid expressions that reflect the genuine bond between teachers and students.",
    layoutType: "film_strip",
    coverImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    displayOrder: 5,
    createdAt: new Date("2026-09-04T13:30:00Z"),
  },
  {
    id: 6,
    chapterNumber: 6,
    title: "MOMENTS IN MOTION",
    subtitle: "Highlights preserved on film",
    description: "Relive the event reel, video montages, energetic flashmob performances, and heartfelt audio-visual tributes created by our media team.",
    layoutType: "video_theater",
    coverImageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    displayOrder: 6,
    createdAt: new Date("2026-09-04T15:00:00Z"),
  },
  {
    id: 7,
    chapterNumber: 7,
    title: "WORDS THAT STAY",
    subtitle: "Messages that inspire a lifetime",
    description: "Wisdom shared by our mentors during their speeches — advice that will guide us long after our engineering degree concludes.",
    layoutType: "editorial",
    coverImageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    displayOrder: 7,
    createdAt: new Date("2026-09-04T16:30:00Z"),
  },
  {
    id: 8,
    chapterNumber: 8,
    title: "BEYOND THE DAY",
    subtitle: "The hands behind the magic",
    description: "A celebration is only as memorable as the dedicated team behind it. Meet the organizers, photographers, and volunteers who poured their hearts into making Teachers' Day 2026 unforgettable.",
    layoutType: "editorial",
    coverImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    displayOrder: 8,
    createdAt: new Date("2026-09-04T18:00:00Z"),
  },
];

export const initialPhotos: Photo[] = [
  {
    id: 1,
    chapterId: 1,
    title: "Floral Wall Setup",
    caption: "Students carefully putting together the marigold and lily entrance backdrop at 7 AM.",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80",
    driveFileId: null,
    layoutStyle: "vintage_frame",
    isFeatured: true,
    status: "published",
    displayOrder: 1,
    createdAt: new Date("2026-09-04T07:15:00Z"),
  },
  {
    id: 2,
    chapterId: 1,
    title: "Welcome Badges",
    caption: "Custom handcrafted wooden lapel pins designed for each professor.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
    driveFileId: null,
    layoutStyle: "polaroid",
    isFeatured: false,
    status: "published",
    displayOrder: 2,
    createdAt: new Date("2026-09-04T07:45:00Z"),
  },
  {
    id: 3,
    chapterId: 2,
    title: "Lighting the Sacred Lamp",
    caption: "Our Head of Department inaugurating the celebration alongside senior faculty.",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80",
    driveFileId: null,
    layoutStyle: "full_bleed",
    isFeatured: true,
    status: "published",
    displayOrder: 1,
    createdAt: new Date("2026-09-04T09:40:00Z"),
  },
  {
    id: 4,
    chapterId: 3,
    title: "Grand Cake Cutting",
    caption: "Teachers gathering together for the ceremonial cake cutting amidst cheerful applause.",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80",
    driveFileId: null,
    layoutStyle: "torn_edge",
    isFeatured: true,
    status: "published",
    displayOrder: 1,
    createdAt: new Date("2026-09-04T11:15:00Z"),
  },
  {
    id: 5,
    chapterId: 4,
    title: "Handmade Portrait Presentation",
    caption: "Presenting custom framed charcoal sketches to our mentors.",
    imageUrl: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1000&q=80",
    driveFileId: null,
    layoutStyle: "vintage_frame",
    isFeatured: true,
    status: "published",
    displayOrder: 1,
    createdAt: new Date("2026-09-04T12:30:00Z"),
  },
  {
    id: 6,
    chapterId: 5,
    title: "Shared Laughter",
    caption: "A candid moment of joy during the interactive Pictionary quiz game.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
    driveFileId: null,
    layoutStyle: "polaroid",
    isFeatured: true,
    status: "published",
    displayOrder: 1,
    createdAt: new Date("2026-09-04T13:45:00Z"),
  },
];

export const initialVideos: Video[] = [
  {
    id: 1,
    chapterId: 6,
    title: "Teachers' Day 2026 — Official Highlight Film",
    description: "A cinematic 3-minute recap capturing every smile, performance, and emotion of the day.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    isShort: false,
    isFeatured: true,
    status: "published",
    displayOrder: 1,
    createdAt: new Date("2026-09-04T15:10:00Z"),
  },
  {
    id: 2,
    chapterId: 6,
    title: "Surprise Flashmob & Dance Performance",
    description: "Sec-D students energetic retro dance tribute dedicated to our professors.",
    youtubeUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    youtubeId: "L_LUpnjgPso",
    thumbnailUrl: "https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg",
    isShort: false,
    isFeatured: true,
    status: "published",
    displayOrder: 2,
    createdAt: new Date("2026-09-04T15:30:00Z"),
  },
];

export const initialTeachers: Teacher[] = [
  {
    id: 1,
    name: "Dr. Aris Thorne",
    department: "Computer Science & Engineering",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    message: "To my dear Sec-D students: teaching you algorithms and systems has been an absolute privilege. Always remain curious, solve problems with empathy, and never stop learning.",
    profileLink: "https://linkedin.com",
    videoUrl: null,
    isFeatured: true,
    status: "published",
    displayOrder: 1,
    createdAt: new Date("2026-09-04T10:00:00Z"),
  },
  {
    id: 2,
    name: "Prof. Elena Rostova",
    department: "Data Structures & AI",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    message: "Thank you for putting together such a magical, thoughtful Teachers' Day. Seeing your dedication today makes me confident that the future of technology is in wonderful hands.",
    profileLink: "https://linkedin.com",
    videoUrl: null,
    isFeatured: true,
    status: "published",
    displayOrder: 2,
    createdAt: new Date("2026-09-04T10:15:00Z"),
  },
  {
    id: 3,
    name: "Prof. Marcus Vance",
    department: "Software Engineering & Architecture",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    message: "The handwritten notes and custom Memory Book are treasures I will keep forever. Keep striving for excellence, Sec-D!",
    profileLink: null,
    videoUrl: null,
    isFeatured: true,
    status: "published",
    displayOrder: 3,
    createdAt: new Date("2026-09-04T10:30:00Z"),
  },
];

export const initialStudentMemories: StudentMemory[] = [
  {
    id: 1,
    authorName: "Aarav Sharma",
    authorRole: "Student, Sec-D CSE",
    message: "Prof. Elena's lecture on neural networks changed how I view computer science forever. Happy Teachers' Day to the absolute best faculty!",
    imageUrl: null,
    category: "gratitude",
    status: "approved",
    isFeatured: true,
    createdAt: new Date("2026-09-04T14:00:00Z"),
  },
  {
    id: 2,
    authorName: "Riya Patel",
    authorRole: "Student, Sec-D CSE",
    message: "Dr. Thorne's patience during final project reviews was legendary. Thank you for guiding us through every bug and concept!",
    imageUrl: null,
    category: "funny",
    status: "approved",
    isFeatured: true,
    createdAt: new Date("2026-09-04T14:30:00Z"),
  },
];

export const initialExternalLinks: ExternalLink[] = [
  {
    id: 1,
    title: "Official High-Res Google Drive Photo Album",
    description: "Browse and download all 250+ full-resolution photographs captured by our media team.",
    platform: "gdrive",
    url: "https://drive.google.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
    isFeatured: true,
    displayOrder: 1,
    createdAt: new Date("2026-09-04T17:00:00Z"),
  },
  {
    id: 2,
    title: "Teachers' Day Reel on Instagram",
    description: "Watch the trending 60-second Instagram Reel featuring behind-the-scenes moments.",
    platform: "instagram",
    url: "https://instagram.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
    isFeatured: true,
    displayOrder: 2,
    createdAt: new Date("2026-09-04T17:15:00Z"),
  },
  {
    id: 3,
    title: "Full Event Video Stream on YouTube",
    description: "Watch the complete 2-hour uncut ceremony recording.",
    platform: "youtube",
    url: "https://youtube.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80",
    isFeatured: true,
    displayOrder: 3,
    createdAt: new Date("2026-09-04T17:30:00Z"),
  },
];

export const initialPeople: Person[] = [
  {
    id: 1,
    name: "Vikramaditya Sen",
    role: "Lead Event Organizer",
    team: "lead",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    bio: "Managed stage logistics, invitations, and schedule flow.",
    displayOrder: 1,
    createdAt: new Date("2026-09-04T18:00:00Z"),
  },
  {
    id: 2,
    name: "Ananya Roy",
    role: "Media & Photography Lead",
    team: "media",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    bio: "Head of video production, photo edits, and digital memory book curation.",
    displayOrder: 2,
    createdAt: new Date("2026-09-04T18:15:00Z"),
  },
  {
    id: 3,
    name: "Karan Mehta",
    role: "Stage & Decoration Coordinator",
    team: "volunteer",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Curated floral arrangements, lighting setup, and vintage aesthetics.",
    displayOrder: 3,
    createdAt: new Date("2026-09-04T18:30:00Z"),
  },
];

// Memory Data Repository Store with mutator helper functions
class MemoryStore {
  chapters: Chapter[] = [...initialChapters];
  photos: Photo[] = [...initialPhotos];
  videos: Video[] = [...initialVideos];
  teachers: Teacher[] = [...initialTeachers];
  memories: StudentMemory[] = [...initialStudentMemories];
  links: ExternalLink[] = [...initialExternalLinks];
  people: Person[] = [...initialPeople];

  // Auto increment counters
  private chapterIdSeq = 10;
  private photoIdSeq = 10;
  private videoIdSeq = 10;
  private teacherIdSeq = 10;
  private memoryIdSeq = 10;
  private linkIdSeq = 10;
  private personIdSeq = 10;

  // Chapters
  getChapters(includeUnpublished = false) {
    return this.chapters
      .filter((c) => includeUnpublished || c.status === 'published')
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  addChapter(data: Partial<Chapter>) {
    const newChapter: Chapter = {
      id: ++this.chapterIdSeq,
      chapterNumber: data.chapterNumber || this.chapters.length + 1,
      title: data.title || 'Untitled Chapter',
      subtitle: data.subtitle || null,
      description: data.description || null,
      layoutType: data.layoutType || 'editorial',
      coverImageUrl: data.coverImageUrl ? formatGDriveImageUrl(data.coverImageUrl) : null,
      status: data.status || 'published',
      displayOrder: data.displayOrder || this.chapters.length + 1,
      createdAt: new Date(),
    };
    this.chapters.push(newChapter);
    return newChapter;
  }

  updateChapter(id: number, data: Partial<Chapter>) {
    const index = this.chapters.findIndex((c) => c.id === id);
    if (index === -1) return null;
    if (data.coverImageUrl) {
      data.coverImageUrl = formatGDriveImageUrl(data.coverImageUrl);
    }
    this.chapters[index] = { ...this.chapters[index], ...data };
    return this.chapters[index];
  }

  deleteChapter(id: number) {
    this.chapters = this.chapters.filter((c) => c.id !== id);
    this.photos = this.photos.filter((p) => p.chapterId !== id);
    this.videos = this.videos.filter((v) => v.chapterId !== id);
    return true;
  }

  // Photos
  getPhotos(chapterId?: number, includeUnpublished = false) {
    return this.photos
      .filter((p) => (includeUnpublished || p.status === 'published') && (!chapterId || p.chapterId === chapterId))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  addPhoto(data: Partial<Photo>) {
    const rawUrl = data.imageUrl || '';
    const formattedUrl = formatGDriveImageUrl(rawUrl);
    const newPhoto: Photo = {
      id: ++this.photoIdSeq,
      chapterId: data.chapterId || null,
      title: data.title || 'Untitled Photo',
      caption: data.caption || null,
      imageUrl: formattedUrl,
      driveFileId: data.driveFileId || null,
      layoutStyle: data.layoutStyle || 'polaroid',
      isFeatured: data.isFeatured || false,
      status: data.status || 'published',
      displayOrder: data.displayOrder || this.photos.length + 1,
      createdAt: new Date(),
    };
    this.photos.push(newPhoto);
    return newPhoto;
  }

  updatePhoto(id: number, data: Partial<Photo>) {
    const index = this.photos.findIndex((p) => p.id === id);
    if (index === -1) return null;
    if (data.imageUrl) {
      data.imageUrl = formatGDriveImageUrl(data.imageUrl);
    }
    this.photos[index] = { ...this.photos[index], ...data };
    return this.photos[index];
  }

  deletePhoto(id: number) {
    this.photos = this.photos.filter((p) => p.id !== id);
    return true;
  }

  // Videos
  getVideos(chapterId?: number, includeUnpublished = false) {
    return this.videos
      .filter((v) => (includeUnpublished || v.status === 'published') && (!chapterId || v.chapterId === chapterId))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  addVideo(data: Partial<Video>) {
    const ytUrl = data.youtubeUrl || '';
    const { videoId, isShort } = extractYouTubeId(ytUrl);
    const thumb = videoId ? getYouTubeThumbnail(videoId) : data.thumbnailUrl || null;

    const newVideo: Video = {
      id: ++this.videoIdSeq,
      chapterId: data.chapterId || null,
      title: data.title || 'Untitled Video',
      description: data.description || null,
      youtubeUrl: ytUrl,
      youtubeId: videoId || 'dQw4w9WgXcQ',
      thumbnailUrl: thumb,
      isShort: data.isShort ?? isShort,
      isFeatured: data.isFeatured || false,
      status: data.status || 'published',
      displayOrder: data.displayOrder || this.videos.length + 1,
      createdAt: new Date(),
    };
    this.videos.push(newVideo);
    return newVideo;
  }

  updateVideo(id: number, data: Partial<Video>) {
    const index = this.videos.findIndex((v) => v.id === id);
    if (index === -1) return null;
    if (data.youtubeUrl) {
      const { videoId, isShort } = extractYouTubeId(data.youtubeUrl);
      data.youtubeId = videoId || this.videos[index].youtubeId;
      data.isShort = isShort;
      data.thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : data.thumbnailUrl;
    }
    this.videos[index] = { ...this.videos[index], ...data };
    return this.videos[index];
  }

  deleteVideo(id: number) {
    this.videos = this.videos.filter((v) => v.id !== id);
    return true;
  }

  // Teachers
  getTeachers(includeUnpublished = false) {
    return this.teachers
      .filter((t) => includeUnpublished || t.status === 'published')
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  addTeacher(data: Partial<Teacher>) {
    const newTeacher: Teacher = {
      id: ++this.teacherIdSeq,
      name: data.name || 'Respected Faculty',
      department: data.department || 'Computer Science & Engineering',
      photoUrl: data.photoUrl ? formatGDriveImageUrl(data.photoUrl) : null,
      message: data.message || '',
      profileLink: data.profileLink || null,
      videoUrl: data.videoUrl || null,
      isFeatured: data.isFeatured || false,
      status: data.status || 'published',
      displayOrder: data.displayOrder || this.teachers.length + 1,
      createdAt: new Date(),
    };
    this.teachers.push(newTeacher);
    return newTeacher;
  }

  updateTeacher(id: number, data: Partial<Teacher>) {
    const index = this.teachers.findIndex((t) => t.id === id);
    if (index === -1) return null;
    if (data.photoUrl) {
      data.photoUrl = formatGDriveImageUrl(data.photoUrl);
    }
    this.teachers[index] = { ...this.teachers[index], ...data };
    return this.teachers[index];
  }

  deleteTeacher(id: number) {
    this.teachers = this.teachers.filter((t) => t.id !== id);
    return true;
  }

  // Student Memories Submissions & Moderation
  getMemories(statusFilter?: string) {
    if (statusFilter) {
      return this.memories.filter((m) => m.status === statusFilter);
    }
    return this.memories;
  }

  addMemory(data: Partial<StudentMemory>) {
    const newMemory: StudentMemory = {
      id: ++this.memoryIdSeq,
      authorName: data.authorName || 'Anonymous Student',
      authorRole: data.authorRole || 'Student, Sec-D',
      message: data.message || '',
      imageUrl: data.imageUrl ? formatGDriveImageUrl(data.imageUrl) : null,
      category: data.category || 'general',
      status: 'pending', // Always requires admin moderation
      isFeatured: false,
      createdAt: new Date(),
    };
    this.memories.unshift(newMemory);
    return newMemory;
  }

  updateMemoryStatus(id: number, status: 'approved' | 'rejected' | 'pending') {
    const index = this.memories.findIndex((m) => m.id === id);
    if (index === -1) return null;
    this.memories[index].status = status;
    return this.memories[index];
  }

  deleteMemory(id: number) {
    this.memories = this.memories.filter((m) => m.id !== id);
    return true;
  }

  // External Links
  getLinks() {
    return this.links.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  addLink(data: Partial<ExternalLink>) {
    const newLink: ExternalLink = {
      id: ++this.linkIdSeq,
      title: data.title || 'External Memory Link',
      description: data.description || null,
      platform: data.platform || 'other',
      url: data.url || '#',
      thumbnailUrl: data.thumbnailUrl ? formatGDriveImageUrl(data.thumbnailUrl) : null,
      isFeatured: data.isFeatured || false,
      displayOrder: data.displayOrder || this.links.length + 1,
      createdAt: new Date(),
    };
    this.links.push(newLink);
    return newLink;
  }

  deleteLink(id: number) {
    this.links = this.links.filter((l) => l.id !== id);
    return true;
  }

  // People
  getPeople() {
    return this.people.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  addPerson(data: Partial<Person>) {
    const newPerson: Person = {
      id: ++this.personIdSeq,
      name: data.name || 'Contributor Name',
      role: data.role || 'Volunteer',
      team: data.team || 'organizer',
      photoUrl: data.photoUrl ? formatGDriveImageUrl(data.photoUrl) : null,
      bio: data.bio || null,
      displayOrder: data.displayOrder || this.people.length + 1,
      createdAt: new Date(),
    };
    this.people.push(newPerson);
    return newPerson;
  }

  deletePerson(id: number) {
    this.people = this.people.filter((p) => p.id !== id);
    return true;
  }
}

export const memoryStore = new MemoryStore();
