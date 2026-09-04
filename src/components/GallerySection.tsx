// ============================================================
// 3D DEPTH CARD CAROUSEL GALLERY SECTION
// Matches the visual reference: Center active card, angled side
// depth cards, spring physics, floating glass controls, and live API data.
// ============================================================
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Calendar,
  MapPin,
  Sparkles,
  BookOpen,
  Feather,
  Camera,
  Layers,
} from 'lucide-react';
import { fetchPhotos, likePhoto } from '../lib/api.ts';
import type { Photo } from '../types/index.ts';

// Categories matching specification
export const GALLERY_CATEGORIES = [
  'ALL',
  'OUR STORY',
  'TEACHERS',
  'GREAT MOMENTS',
  'STUDENTS',
  'ACTIVITIES',
  'GIFTS',
  'CANDID',
  'MEMORIES',
  'BEHIND THE SCENES',
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

// Fallback curated dataset matching the aesthetic
const FALLBACK_PHOTOS: Photo[] = [
  {
    id: 1,
    chapterId: 1,
    category: 'OUR STORY',
    title: 'The Morning Prelude',
    caption: 'Setting up the floral wall and welcome foyer before sunrise.',
    description: 'Students gathering at 7 AM to prepare the marigold entrance and handcraft each welcome kit.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    date: 'September 4, 2026 • 07:15 AM',
    location: 'Main Foyer, Block C',
    uploadedBy: 'Media Team Sec-D',
    likes: 42,
    isFeatured: true,
    layoutStyle: 'vintage_frame',
    status: 'published',
    displayOrder: 1,
    createdAt: '2026-09-04T07:15:00Z',
  },
  {
    id: 2,
    chapterId: 2,
    category: 'GREAT MOMENTS',
    title: 'Lighting the Eternal Flame',
    caption: 'Inaugurating Teachers’ Day 2026 with the ceremonial brass lamp.',
    description: 'Our esteemed professors and HoD illuminating the lamp amidst Vedic hymns and respectful silence.',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    date: 'September 4, 2026 • 09:30 AM',
    location: 'Silver Jubilee Auditorium',
    uploadedBy: 'Organizing Committee',
    likes: 88,
    isFeatured: true,
    layoutStyle: 'full_bleed',
    status: 'published',
    displayOrder: 2,
    createdAt: '2026-09-04T09:30:00Z',
  },
  {
    id: 3,
    chapterId: 3,
    category: 'TEACHERS',
    title: 'The Mentors Who Shape Us',
    caption: 'Faculty members sharing laughter during the opening keynote.',
    description: 'A rare candid portrait of our beloved professors smiling together on stage.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    date: 'September 4, 2026 • 10:45 AM',
    location: 'Auditorium Main Stage',
    uploadedBy: 'Photography Club',
    likes: 135,
    isFeatured: true,
    layoutStyle: 'polaroid',
    status: 'published',
    displayOrder: 3,
    createdAt: '2026-09-04T10:45:00Z',
  },
  {
    id: 4,
    chapterId: 4,
    category: 'STUDENTS',
    title: 'Behind the Curtains',
    caption: 'Section-D volunteers coordinating the technical lighting and sound.',
    description: 'Days of rehearsal, script writing, and video editing paying off in seamless execution.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    date: 'September 4, 2026 • 11:20 AM',
    location: 'Backstage Control Booth',
    uploadedBy: 'Tech Crew',
    likes: 64,
    isFeatured: true,
    layoutStyle: 'torn_edge',
    status: 'published',
    displayOrder: 4,
    createdAt: '2026-09-04T11:20:00Z',
  },
  {
    id: 5,
    chapterId: 5,
    category: 'ACTIVITIES',
    title: 'The Guess-The-Voice Quiz',
    caption: 'Teachers competing enthusiastically in our custom retro game show.',
    description: 'Hilarious moments as professors guessed anonymous audio clips of student imitations.',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    date: 'September 4, 2026 • 01:15 PM',
    location: 'Seminar Hall 1',
    uploadedBy: 'Event Hosts',
    likes: 92,
    isFeatured: true,
    layoutStyle: 'polaroid',
    status: 'published',
    displayOrder: 5,
    createdAt: '2026-09-04T13:15:00Z',
  },
  {
    id: 6,
    chapterId: 6,
    category: 'GIFTS',
    title: 'Handmade Charcoal Tributes',
    caption: 'Custom sketched portraits presented to each mentor with personalized notes.',
    description: 'Each drawing took over 20 hours to craft, capturing the mentor’s distinct personality.',
    imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80',
    date: 'September 4, 2026 • 02:45 PM',
    location: 'Faculty Lounge',
    uploadedBy: 'Art Guild Sec-D',
    likes: 110,
    isFeatured: true,
    layoutStyle: 'vintage_frame',
    status: 'published',
    displayOrder: 6,
    createdAt: '2026-09-04T14:45:00Z',
  },
  {
    id: 7,
    chapterId: 7,
    category: 'CANDID',
    title: 'Unscripted Laughter',
    caption: '“An afternoon we’ll never forget.”',
    description: 'Caught in between transitions: our HOD laughing heartily at student jokes during lunch break.',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
    date: 'September 4, 2026 • 03:30 PM',
    location: 'Central Courtyard',
    uploadedBy: 'Candid Sec-D',
    likes: 176,
    isFeatured: true,
    layoutStyle: 'polaroid',
    status: 'published',
    displayOrder: 7,
    createdAt: '2026-09-04T15:30:00Z',
  },
  {
    id: 8,
    chapterId: 8,
    category: 'MEMORIES',
    title: 'Standing Ovation & Warm Hugs',
    caption: 'Final group gathering as gold confetti filled the auditorium air.',
    description: 'Four years of CSE Section-D coming together in gratitude and lifelong brotherhood.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    date: 'September 4, 2026 • 05:00 PM',
    location: 'Grand Amphitheatre',
    uploadedBy: 'Batch 2026',
    likes: 210,
    isFeatured: true,
    layoutStyle: 'vintage_frame',
    status: 'published',
    displayOrder: 8,
    createdAt: '2026-09-04T17:00:00Z',
  },
  {
    id: 9,
    chapterId: 8,
    category: 'BEHIND THE SCENES',
    title: 'Midnight Editing Room',
    caption: 'The media editing suite working through 4,000 raw video clips and photos.',
    description: 'Coffee cups, timeline cuts, and boundless enthusiasm making sure this hall of fame lives forever.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    date: 'September 4, 2026 • 11:45 PM',
    location: 'Design Studio, Lab 4',
    uploadedBy: 'Web & Core Team',
    likes: 95,
    isFeatured: true,
    layoutStyle: 'torn_edge',
    status: 'published',
    displayOrder: 9,
    createdAt: '2026-09-04T23:45:00Z',
  },
];

interface GallerySectionProps {
  onImageClick?: (src: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onImageClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('ALL');
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_PHOTOS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [isHovering, setIsHovering] = useState(false);

  // Mouse Parallax
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  const tiltRotateY = useTransform(smoothMouseX, [-400, 400], [-4, 4]);
  const tiltRotateX = useTransform(smoothMouseY, [-300, 300], [3, -3]);

  // Load photos from API
  const loadPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchPhotos(selectedCategory === 'ALL' ? undefined : selectedCategory);
      if (data && data.length > 0) {
        setPhotos(data);
      } else if (selectedCategory === 'ALL') {
        setPhotos(FALLBACK_PHOTOS);
      } else {
        const filtered = FALLBACK_PHOTOS.filter(
          (p) => p.category?.toUpperCase() === selectedCategory.toUpperCase()
        );
        setPhotos(filtered);
      }
    } catch {
      const filtered =
        selectedCategory === 'ALL'
          ? FALLBACK_PHOTOS
          : FALLBACK_PHOTOS.filter(
              (p) => p.category?.toUpperCase() === selectedCategory.toUpperCase()
            );
      setPhotos(filtered);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Reset activeIndex when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  // Filtered photos
  const displayPhotos = useMemo(() => {
    if (selectedCategory === 'ALL') return photos;
    return photos.filter(
      (p) => p.category?.toUpperCase() === selectedCategory.toUpperCase()
    );
  }, [photos, selectedCategory]);

  const activePhoto = displayPhotos[activeIndex] || displayPhotos[0];

  // Initialize like counts
  useEffect(() => {
    const counts: Record<number, number> = {};
    displayPhotos.forEach((p) => {
      counts[p.id] = p.likes || 0;
    });
    setLikeCounts((prev) => ({ ...counts, ...prev }));
  }, [displayPhotos]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (displayPhotos.length <= 1) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayPhotos.length - 1));
  }, [displayPhotos.length]);

  const handleNext = useCallback(() => {
    if (displayPhotos.length <= 1) return;
    setActiveIndex((prev) => (prev < displayPhotos.length - 1 ? prev + 1 : 0));
  }, [displayPhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Gentle Autoplay (pauses on hover / interaction)
  useEffect(() => {
    if (isHovering || displayPhotos.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev < displayPhotos.length - 1 ? prev + 1 : 0));
    }, 7000);
    return () => clearInterval(timer);
  }, [isHovering, displayPhotos.length]);

  // Mouse Move Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovering(false);
  };

  // Like reaction handler
  const handleLike = async (e: React.MouseEvent, photoId: number) => {
    e.stopPropagation();
    const isLiked = likedMap[photoId];
    setLikedMap((prev) => ({ ...prev, [photoId]: !isLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + (isLiked ? -1 : 1),
    }));

    try {
      if (!isLiked) {
        await likePhoto(photoId);
      }
    } catch (err) {
      console.warn('Like sync offline');
    }
  };

  // Drag Gesture Handlers
  const dragStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    setIsHovering(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - dragStartX.current;
    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
    dragStartX.current = null;
  };

  return (
    <section
      id="memories"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#0e0407] via-[#15060b] to-[#0e0407] select-none"
      style={{
        perspective: '1300px',
      }}
    >
      {/* Background Ambient Glows & Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(201,164,99,0.07)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(184,95,70,0.08)_0%,transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(14,4,7,0.85)_100%)] pointer-events-none" />
      </div>

      {/* Memory Book Connection Transition Bridge */}
      <div className="max-w-4xl mx-auto mb-10 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[rgba(201,164,99,0.08)] border border-[rgba(201,164,99,0.22)] mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c9a463]" />
          <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.22em] text-[#c9a463] uppercase">
            THROUGH OUR LENS
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#f2e8d5] font-bold tracking-tight mb-4"
        >
          The Moments We Keep
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif italic text-base sm:text-lg md:text-xl text-[rgba(242,232,213,0.7)] max-w-2xl leading-relaxed"
        >
          “A collection of laughter, gratitude, friendship and moments worth remembering.”
        </motion.p>
      </div>

      {/* 10-Category Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-6xl mx-auto mb-12 relative z-20"
      >
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto py-2 px-2 no-scrollbar space-x-2 sm:space-x-2.5">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3.5 py-1.5 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider transition-all whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'text-[#0e0407]'
                    : 'text-[rgba(242,232,213,0.7)] hover:text-[#e2c27e] bg-[rgba(255,255,255,0.03)] border border-[rgba(201,164,99,0.18)] hover:border-[rgba(201,164,99,0.4)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="gallery-active-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#c9a463] to-[#e2c27e] shadow-[0_0_15px_rgba(201,164,99,0.4)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Empty State */}
      {displayPhotos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-[#16060b] border border-[rgba(201,164,99,0.25)] text-center shadow-2xl relative z-10"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(201,164,99,0.1)] border border-[rgba(201,164,99,0.3)] flex items-center justify-center text-[#c9a463]">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl text-[#f2e8d5] font-bold mb-2">
            Memories are waiting to be added.
          </h3>
          <p className="text-xs text-[rgba(201,164,99,0.7)] mb-6 font-sans">
            No photographs have been published under this category yet.
          </p>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="px-5 py-2 rounded-full bg-[#c9a463] text-[#0e0407] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
          >
            Explore All Memories
          </button>
        </motion.div>
      )}

      {/* 3D Depth Card Carousel */}
      {displayPhotos.length > 0 && (
        <motion.div
          style={{
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative max-w-7xl mx-auto min-h-[460px] sm:min-h-[520px] md:min-h-[580px] flex items-center justify-center my-6 z-10"
        >
          {/* Left Circular Floating Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous Memory"
            className="absolute left-2 sm:left-6 md:left-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[rgba(22,6,11,0.85)] border border-[rgba(201,164,99,0.4)] backdrop-blur-md text-[#f2e8d5] hover:text-[#c9a463] hover:border-[#c9a463] hover:scale-110 active:scale-95 transition-all shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex items-center justify-center focus:outline-none"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Circular Floating Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next Memory"
            className="absolute right-2 sm:right-6 md:right-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[rgba(22,6,11,0.85)] border border-[rgba(201,164,99,0.4)] backdrop-blur-md text-[#f2e8d5] hover:text-[#c9a463] hover:border-[#c9a463] hover:scale-110 active:scale-95 transition-all shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex items-center justify-center focus:outline-none"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Card Stack Container */}
          <div
            className="relative w-full h-[440px] sm:h-[500px] md:h-[540px] flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {displayPhotos.map((photo, index) => {
              const total = displayPhotos.length;
              // Calculate relative offset from active index with wrapping
              let offset = index - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              // Hide cards that are too far away for performance
              if (Math.abs(offset) > 3) return null;

              const isActive = offset === 0;
              const isLeft1 = offset === -1;
              const isRight1 = offset === 1;
              const isLeft2 = offset === -2;
              const isRight2 = offset === 2;

              // 3D Spatial Calculation matching user prompt
              let xTransform = '0%';
              let zTransform = 0;
              let rotateYDeg = 0;
              let scaleVal = 1;
              let opacityVal = 1;
              let zIndexVal = 30;
              let brightnessVal = 1;

              if (isActive) {
                xTransform = '0%';
                zTransform = 0;
                rotateYDeg = 0;
                scaleVal = 1;
                opacityVal = 1;
                zIndexVal = 30;
                brightnessVal = 1;
              } else if (isLeft1) {
                xTransform = '-55%';
                zTransform = -120;
                rotateYDeg = 14;
                scaleVal = 0.82;
                opacityVal = 0.72;
                zIndexVal = 20;
                brightnessVal = 0.65;
              } else if (isRight1) {
                xTransform = '55%';
                zTransform = -120;
                rotateYDeg = -14;
                scaleVal = 0.82;
                opacityVal = 0.72;
                zIndexVal = 20;
                brightnessVal = 0.65;
              } else if (isLeft2) {
                xTransform = '-92%';
                zTransform = -240;
                rotateYDeg = 20;
                scaleVal = 0.68;
                opacityVal = 0.42;
                zIndexVal = 10;
                brightnessVal = 0.45;
              } else if (isRight2) {
                xTransform = '92%';
                zTransform = -240;
                rotateYDeg = -20;
                scaleVal = 0.68;
                opacityVal = 0.42;
                zIndexVal = 10;
                brightnessVal = 0.45;
              } else {
                xTransform = offset < 0 ? '-125%' : '125%';
                zTransform = -360;
                rotateYDeg = offset < 0 ? 28 : -28;
                scaleVal = 0.52;
                opacityVal = 0;
                zIndexVal = 1;
                brightnessVal = 0.2;
              }

              return (
                <motion.div
                  key={photo.id}
                  onClick={() => {
                    if (isActive) {
                      if (onImageClick) onImageClick(photo.imageUrl);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                  animate={{
                    x: xTransform,
                    z: zTransform,
                    rotateY: rotateYDeg,
                    scale: scaleVal,
                    opacity: opacityVal,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 26,
                    mass: 0.8,
                  }}
                  style={{
                    position: 'absolute',
                    zIndex: zIndexVal,
                    transformStyle: 'preserve-3d',
                    cursor: isActive ? 'zoom-in' : 'pointer',
                  }}
                  className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] h-[390px] sm:h-[450px] md:h-[490px] lg:h-[510px] rounded-2xl p-2.5 bg-gradient-to-b from-[#2a0e18] via-[#1a080f] to-[#120509] border border-[rgba(201,164,99,0.35)] shadow-[0_25px_60px_rgba(0,0,0,0.85)] group transition-shadow duration-300 hover:border-[rgba(201,164,99,0.65)]"
                >
                  {/* Photo Container Frame */}
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#0a0205]">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      loading="lazy"
                      style={{
                        filter: `brightness(${brightnessVal}) contrast(1.05) saturate(0.95)`,
                      }}
                      className="w-full h-full object-cover rounded-xl transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Warm Vignette and Paper Grain Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0407] via-[rgba(14,4,7,0.2)] to-transparent opacity-85 pointer-events-none" />
                    <div className="absolute inset-0 border border-[rgba(201,164,99,0.2)] rounded-xl pointer-events-none" />

                    {/* Top Tag & Like Pill */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-auto">
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-sans font-bold tracking-widest text-[#c9a463] uppercase bg-[rgba(14,4,7,0.75)] backdrop-blur-md border border-[rgba(201,164,99,0.3)] shadow-sm">
                        {photo.category || 'MEMORIES'}
                      </span>

                      <button
                        onClick={(e) => handleLike(e, photo.id)}
                        className={`p-1.5 rounded-full backdrop-blur-md border transition-all ${
                          likedMap[photo.id]
                            ? 'bg-[#c9a463] text-[#0e0407] border-[#c9a463] scale-110'
                            : 'bg-[rgba(14,4,7,0.75)] text-[#f2e8d5] border-[rgba(201,164,99,0.3)] hover:text-[#c9a463]'
                        }`}
                        title="React with Love"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${likedMap[photo.id] ? 'fill-current' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Center Active Card Text Overlay */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 p-5 pt-8 bg-gradient-to-t from-[#0e0407] via-[#0e0407]/90 to-transparent pointer-events-auto">
                        <div className="text-[10px] font-sans font-semibold text-[#c9a463] tracking-[0.2em] uppercase mb-1">
                          TEACHERS' DAY 2026
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f2e8d5] leading-tight mb-1.5 drop-shadow-md line-clamp-1">
                          {photo.title}
                        </h3>
                        {photo.caption && (
                          <p className="font-serif italic text-xs sm:text-sm text-[rgba(242,232,213,0.8)] line-clamp-2 leading-snug mb-2">
                            {photo.caption}
                          </p>
                        )}
                        <div className="flex items-center space-x-3 text-[10px] text-[rgba(201,164,99,0.75)] font-sans">
                          {photo.date && (
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{photo.date.split('•')[0]}</span>
                            </span>
                          )}
                          {photo.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{photo.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Magnify Icon Hint on Active Card */}
                    {isActive && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[rgba(14,4,7,0.7)] border border-[rgba(201,164,99,0.4)] backdrop-blur-md flex items-center justify-center text-[#c9a463] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Floating Glass/Paper Bottom Info & Control Panel */}
      {activePhoto && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto mt-4 px-4 relative z-30"
        >
          <div className="rounded-2xl p-4 sm:p-5 bg-[rgba(22,6,11,0.85)] border border-[rgba(201,164,99,0.35)] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left Thumbnail + Meta */}
            <div className="flex items-center space-x-3.5 min-w-0 flex-1 w-full sm:w-auto">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                onClick={() => onImageClick && onImageClick(activePhoto.imageUrl)}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[rgba(201,164,99,0.3)] shadow-md flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c9a463]">
                    {activePhoto.category || 'MEMORIES'}
                  </span>
                  <span className="text-[10px] text-[rgba(201,164,99,0.5)]">•</span>
                  <span className="text-[10px] font-sans text-[rgba(242,232,213,0.6)]">
                    {activePhoto.date || "Teachers' Day 2026"}
                  </span>
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#f2e8d5] truncate">
                  {activePhoto.title}
                </h4>
                {activePhoto.location && (
                  <p className="text-[11px] text-[rgba(201,164,99,0.7)] truncate flex items-center space-x-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>{activePhoto.location}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right Nav & Heart Controls: <  ♡  > */}
            <div className="flex items-center space-x-2.5 flex-shrink-0">
              <button
                onClick={handlePrev}
                aria-label="Previous Photo"
                className="w-9 h-9 rounded-full bg-[rgba(34,10,18,0.8)] border border-[rgba(201,164,99,0.3)] hover:border-[#c9a463] text-[#f2e8d5] hover:text-[#c9a463] hover:scale-105 active:scale-95 transition-all flex items-center justify-center focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => handleLike(e, activePhoto.id)}
                aria-label="Heart Reaction"
                className={`px-3 py-1.5 rounded-full border flex items-center space-x-1.5 transition-all focus:outline-none ${
                  likedMap[activePhoto.id]
                    ? 'bg-[#c9a463] text-[#0e0407] border-[#c9a463] shadow-[0_0_12px_rgba(201,164,99,0.4)]'
                    : 'bg-[rgba(34,10,18,0.8)] text-[#f2e8d5] border-[rgba(201,164,99,0.3)] hover:text-[#c9a463]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${likedMap[activePhoto.id] ? 'fill-current' : ''}`}
                />
                <span className="text-xs font-bold font-sans">
                  {likeCounts[activePhoto.id] || activePhoto.likes || 0}
                </span>
              </button>

              <button
                onClick={handleNext}
                aria-label="Next Photo"
                className="w-9 h-9 rounded-full bg-[rgba(34,10,18,0.8)] border border-[rgba(201,164,99,0.3)] hover:border-[#c9a463] text-[#f2e8d5] hover:text-[#c9a463] hover:scale-105 active:scale-95 transition-all flex items-center justify-center focus:outline-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Small Pagination Indicators / Progress Dots */}
          <div className="flex items-center justify-center space-x-1.5 mt-3.5">
            {displayPhotos.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                  dotIdx === activeIndex
                    ? 'w-6 bg-[#c9a463] shadow-[0_0_8px_rgba(201,164,99,0.5)]'
                    : 'w-1.5 bg-[rgba(201,164,99,0.25)] hover:bg-[rgba(201,164,99,0.45)]'
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
};
