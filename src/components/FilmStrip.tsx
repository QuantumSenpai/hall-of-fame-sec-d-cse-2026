import React, { useState } from 'react';
import { Photo, Video } from '../types/index.ts';
import { Play, X } from 'lucide-react';

interface FilmStripProps {
  photos?: Photo[];
  videos?: Video[];
}

export const FilmStrip: React.FC<FilmStripProps> = ({ photos = [], videos = [] }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const totalItems = [...videos.map((v) => ({ ...v, type: 'video' as const })), ...photos.map((p) => ({ ...p, type: 'photo' as const }))];

  if (totalItems.length === 0) return null;

  return (
    <div className="w-full py-6">
      {/* Vintage Film Reel Container */}
      <div className="relative bg-[#121413] border-y-4 border-[#B9905A] p-4 shadow-2xl overflow-x-auto">
        {/* Top Sprocket Holes */}
        <div className="flex justify-between items-center mb-3 space-x-4 px-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-4 h-3 bg-[#292D2B] rounded-xs border border-[#B9905A]/30 flex-shrink-0" />
          ))}
        </div>

        {/* Film Strip Frames Carousel */}
        <div className="flex space-x-6 px-4">
          {totalItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex-shrink-0 w-72 sm:w-80 bg-[#1A1D1B] border-2 border-[#B9905A]/40 p-2 rounded shadow-md group cursor-pointer"
              onClick={() => {
                if (item.type === 'video' && 'youtubeId' in item) {
                  setActiveVideoId(item.youtubeId);
                }
              }}
            >
              <div className="relative h-48 bg-charcoal rounded overflow-hidden">
                <img
                  src={item.type === 'video' ? ('thumbnailUrl' in item && item.thumbnailUrl ? item.thumbnailUrl : `https://img.youtube.com/vi/${(item as any).youtubeId}/hqdefault.jpg`) : ('imageUrl' in item ? item.imageUrl : '')}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center group-hover:bg-charcoal/30 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#B9905A] text-charcoal flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <h5 className="font-serif text-sm text-[#EFE6CA] truncate font-semibold">
                  {item.title}
                </h5>
                <p className="font-sans text-[11px] text-[#44636A] uppercase tracking-wider">
                  {item.type === 'video' ? 'VIDEO HIGHLIGHT' : 'CAMERA REEL'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sprocket Holes */}
        <div className="flex justify-between items-center mt-3 space-x-4 px-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-4 h-3 bg-[#292D2B] rounded-xs border border-[#B9905A]/30 flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Embedded YouTube Modal */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#1A1D1B] border-2 border-[#B9905A] rounded-lg overflow-hidden p-2">
            <button
              onClick={() => setActiveVideoId(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-[#292D2B] text-[#EFE6CA] rounded-full hover:bg-[#B9905A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                title="YouTube Video Player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
