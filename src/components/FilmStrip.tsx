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
      <div className="relative bg-[#0e0407] border-y-4 border-[#c9a463] p-4 shadow-2xl overflow-x-auto">
        {/* Top Sprocket Holes */}
        <div className="flex justify-between items-center mb-3 space-x-4 px-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-4 h-3 bg-[#220912] rounded-xs border border-[rgba(201,164,99,0.35)] flex-shrink-0" />
          ))}
        </div>

        {/* Film Strip Frames Carousel */}
        <div className="flex space-x-6 px-4">
          {totalItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex-shrink-0 w-72 sm:w-80 bg-[#16060b] border-2 border-[rgba(201,164,99,0.35)] p-2.5 rounded-xl shadow-lg group cursor-pointer hover:border-[#c9a463] transition-all"
              onClick={() => {
                if (item.type === 'video' && 'youtubeId' in item) {
                  setActiveVideoId(item.youtubeId);
                }
              }}
            >
              <div className="relative h-48 bg-[#200810] rounded-lg overflow-hidden border border-[rgba(201,164,99,0.2)]">
                <img
                  src={item.type === 'video' ? ('thumbnailUrl' in item && item.thumbnailUrl ? item.thumbnailUrl : `https://img.youtube.com/vi/${(item as any).youtubeId}/hqdefault.jpg`) : ('imageUrl' in item ? item.imageUrl : '')}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <h5 className="font-serif text-sm text-[#f2e8d5] truncate font-semibold">
                  {item.title}
                </h5>
                <p className="font-sans text-[11px] text-[rgba(201,164,99,0.7)] uppercase tracking-wider mt-0.5">
                  {item.type === 'video' ? 'VIDEO HIGHLIGHT' : 'CAMERA REEL'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sprocket Holes */}
        <div className="flex justify-between items-center mt-3 space-x-4 px-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-4 h-3 bg-[#220912] rounded-xs border border-[rgba(201,164,99,0.35)] flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Embedded YouTube Modal */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 bg-[#070204]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#16060b] border border-[rgba(201,164,99,0.4)] rounded-2xl overflow-hidden p-3 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(201,164,99,0.15)]">
            <button
              onClick={() => setActiveVideoId(null)}
              className="absolute top-5 right-5 z-10 p-2 bg-[#220912] border border-[#c9a463] text-[#c9a463] rounded-full hover:bg-[#c9a463] hover:text-[#0e0407] transition-colors shadow"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden">
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
