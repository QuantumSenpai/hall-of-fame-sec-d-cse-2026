import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '../types/index.ts';
import { likePhoto } from '../lib/api.ts';

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

interface BentoGalleryProps {
  photos: Photo[];
  className?: string;
}

export const BentoGallery: React.FC<BentoGalleryProps> = ({
  photos,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [localLikes, setLocalLikes] = useState<Record<number, number>>({});

  // Image DOM element refs for rAF parallax (avoiding React re-renders)
  const imageRefs = useRef<Map<number, HTMLImageElement>>(new Map());
  const rafId = useRef<number | null>(null);

  // Filter items by category
  const filteredItems = React.useMemo(() => {
    if (activeCategory === 'ALL') return photos;
    return photos.filter(
      (item) => item.category?.toUpperCase() === activeCategory.toUpperCase()
    );
  }, [photos, activeCategory]);

  // rAF-throttled scroll parallax for desktop (disabled below 768px)
  useEffect(() => {
    const updateParallax = () => {
      // Disable parallax completely below 768px breakpoint for battery/performance
      if (typeof window === 'undefined' || window.innerWidth < 768) {
        imageRefs.current.forEach((img) => {
          if (img) img.style.transform = 'none';
        });
        return;
      }

      const viewportHeight = window.innerHeight;
      imageRefs.current.forEach((img) => {
        if (!img) return;
        const rect = img.getBoundingClientRect();
        // Only compute if inside or near viewport
        if (rect.top < viewportHeight + 100 && rect.bottom > -100) {
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = viewportHeight / 2;
          const offset = (elementCenter - viewportCenter) * 0.07; // smooth subtle shift
          img.style.transform = `scale(1.08) translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });
    };

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        updateParallax();
        rafId.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateParallax(); // Initial run

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [filteredItems]);

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleLike = async (e: React.MouseEvent, photoId: number) => {
    e.stopPropagation();
    // Optimistic UI update
    setLocalLikes((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] ?? photos.find((p) => p.id === photoId)?.likes ?? 0) + 1,
    }));

    try {
      const res = await likePhoto(photoId);
      if (res && typeof res.likes === 'number') {
        const count = res.likes;
        setLocalLikes((prev) => ({ ...prev, [photoId]: count }));
      }
    } catch (err) {
      console.error('Failed to like photo:', err);
    }
  };

  // Keyboard navigation for Lightbox: ONLY Esc, Left Arrow, Right Arrow
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
      }
    },
    [selectedIndex, filteredItems.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Mixed Bento grid spans (2x2, 1x2, 1x1)
  const getBentoSpan = (index: number) => {
    const mod = index % 6;
    if (mod === 0) return 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2'; // 2x2 Hero
    if (mod === 3) return 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-1'; // 1x2 Wide
    return 'col-span-1 md:col-span-1 md:row-span-1'; // 1x1 Standard
  };

  const activeLightboxItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <div className={`w-full ${className}`}>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {GALLERY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive
                  ? 'bg-[#C9A05C] text-[#0D0B08] shadow-lg shadow-[#C9A05C]/20 scale-105 font-bold'
                  : 'bg-[#16130E] text-[#F5EFE1]/70 border border-[#C9A05C]/20 hover:border-[#C9A05C]/50 hover:text-[#F5EFE1]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Responsive Bento Grid with Parallax-enabled image viewports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] md:auto-rows-[250px] gap-4">
        {filteredItems.map((item, idx) => {
          const isLoaded = loadedImages[item.id];
          const bentoClass = getBentoSpan(idx);
          const currentLikes = localLikes[item.id] !== undefined ? localLikes[item.id] : item.likes || 0;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              className={`relative rounded-xl overflow-hidden cursor-pointer group bg-[#16130E] border border-[#C9A05C]/20 hover:border-[#C9A05C]/60 shadow-md hover:shadow-2xl transition-all duration-300 ${bentoClass}`}
            >
              {/* Skeleton Loader Placeholder */}
              {!isLoaded && (
                <div className="absolute inset-0 skeleton-box z-10" />
              )}

              {/* Media Container with Parallax Transform */}
              <div className="w-full h-full overflow-hidden relative">
                <img
                  ref={(el) => {
                    if (el) imageRefs.current.set(item.id, el);
                    else imageRefs.current.delete(item.id);
                  }}
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  onLoad={() => handleImageLoad(item.id)}
                  className={`w-full h-full object-cover will-change-transform filter transition-opacity duration-500 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transform: 'none' }}
                />
              </div>

              {/* Hover Overlay with Short Label and Italic Description */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B08]/95 via-[#0D0B08]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 p-5 flex flex-col justify-end z-20">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C9A05C]">
                    {item.category || 'MEMORIES'}
                  </span>

                  <button
                    onClick={(e) => handleLike(e, item.id)}
                    aria-label="Like photo"
                    className="flex items-center space-x-1 text-xs text-[#F5EFE1] hover:text-[#D4AF6A] transition-colors p-1 bg-black/50 backdrop-blur-sm rounded-full px-2 border border-[#C9A05C]/30"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#5C1F2E] text-[#5C1F2E]" />
                    <span className="font-semibold">{currentLikes}</span>
                  </button>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#F5EFE1] line-clamp-1">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="font-sans text-xs text-[#F5EFE1]/80 italic line-clamp-2 mt-0.5">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal (Keyboard: Esc, Left, Right) */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              aria-label="Close Lightbox"
              className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-[#16130E] border border-[#C9A05C]/30 text-[#F5EFE1] hover:bg-[#C9A05C] hover:text-[#0D0B08] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
              }}
              aria-label="Previous photo"
              className="absolute left-4 sm:left-6 p-3 rounded-full bg-[#16130E]/80 border border-[#C9A05C]/30 text-[#F5EFE1] hover:bg-[#C9A05C] hover:text-[#0D0B08] transition-colors z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
              }}
              aria-label="Next photo"
              className="absolute right-4 sm:right-6 p-3 rounded-full bg-[#16130E]/80 border border-[#C9A05C]/30 text-[#F5EFE1] hover:bg-[#C9A05C] hover:text-[#0D0B08] transition-colors z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Card Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-[#16130E] border border-[#C9A05C]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeLightboxItem.imageUrl}
                  alt={activeLightboxItem.title}
                  className="max-h-[65vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="p-6 bg-[#16130E] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-[#C9A05C]/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#C9A05C]">
                      {activeLightboxItem.category || 'MEMORIES'}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-[#F5EFE1]">
                    {activeLightboxItem.title}
                  </h2>
                  {activeLightboxItem.caption && (
                    <p className="font-sans text-sm text-[#F5EFE1]/80 italic">
                      {activeLightboxItem.caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(e, activeLightboxItem.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D0B08] border border-[#C9A05C]/40 hover:border-[#C9A05C] text-[#F5EFE1] transition-all"
                  >
                    <Heart className="w-4 h-4 fill-[#5C1F2E] text-[#5C1F2E]" />
                    <span className="text-sm font-semibold">
                      {localLikes[activeLightboxItem.id] !== undefined
                        ? localLikes[activeLightboxItem.id]
                        : activeLightboxItem.likes || 0}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
