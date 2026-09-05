import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Film, Sparkles } from 'lucide-react';
import type { Video } from '../types/index.ts';

interface EditsAndMomentsProps {
  videos: Video[];
  className?: string;
}

export const EditsAndMoments: React.FC<EditsAndMomentsProps> = ({
  videos,
  className = '',
}) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Esc key closes modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeVideoId) {
        setActiveVideoId(null);
      }
    },
    [activeVideoId]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          const thumbnail =
            video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

          return (
            <div
              key={video.id}
              onClick={() => setActiveVideoId(video.youtubeId)}
              className="group relative bg-[#16130E] border border-[#C9A05C]/20 hover:border-[#C9A05C]/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                <img
                  src={thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.92]"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B08] via-black/20 to-transparent" />

                {/* Circular Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#0D0B08]/85 backdrop-blur-md border border-[#C9A05C] flex items-center justify-center text-[#C9A05C] shadow-2xl group-hover:scale-110 group-hover:bg-[#C9A05C] group-hover:text-[#0D0B08] transition-all duration-300">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C9A05C]/30 text-[10px] font-sans font-bold uppercase tracking-wider text-[#C9A05C] flex items-center space-x-1">
                  <Film className="w-3 h-3" />
                  <span>Highlight Edit</span>
                </div>
              </div>

              {/* Text Meta Container */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#F5EFE1] group-hover:text-[#D4AF6A] transition-colors line-clamp-1">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="font-sans text-xs text-[#F5EFE1]/75 italic line-clamp-2 mt-1 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#C9A05C]/10 flex items-center justify-between text-[11px] text-[#C9A05C]/80">
                  <span className="font-mono">YouTube Reel</span>
                  <span className="text-[#F5EFE1]/50 group-hover:text-[#C9A05C] transition-colors flex items-center space-x-1">
                    <span>Watch Modal</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded YouTube Modal Player */}
      <AnimatePresence>
        {activeVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveVideoId(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoId(null)}
              aria-label="Close Video"
              className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-[#16130E] border border-[#C9A05C]/40 text-[#F5EFE1] hover:bg-[#C9A05C] hover:text-[#0D0B08] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Player Modal Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-[#C9A05C]/50 shadow-2xl bg-black"
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="Celebration Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
