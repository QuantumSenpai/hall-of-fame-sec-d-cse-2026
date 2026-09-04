import React from 'react';
import { motion } from 'framer-motion';

interface VintageBook3DProps {
  coverRotationY: number; // 0 to -180 degrees
  bookRotationY: number;  // Intro/scroll Y rotation
  bookRotateX: number;    // Intro/scroll X tilt
  bookScale: number;      // Zoom scale
  bookZ: number;          // Z translation
  activeChapterTitle?: string;
  activeChapterSubtitle?: string;
  isBookClosed?: boolean;
}

export const VintageBook3D: React.FC<VintageBook3DProps> = ({
  coverRotationY,
  bookRotationY,
  bookRotateX,
  bookScale,
  bookZ,
  activeChapterTitle = "Teachers' Day 2026",
  activeChapterSubtitle = "Sec-D CSE Digital Memory Book",
  isBookClosed = false,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-2000 pointer-events-none select-none">
      {/* 3D Book Object Container */}
      <motion.div
        className="relative w-[340px] sm:w-[480px] md:w-[580px] h-[460px] sm:h-[600px] md:h-[680px] transform-style-3d shadow-book transition-transform duration-100 ease-out"
        style={{
          rotateX: `${bookRotateX}deg`,
          rotateY: `${bookRotationY}deg`,
          scale: bookScale,
          z: bookZ,
        }}
      >
        {/* Book Spine (Left edge 3D thickness) */}
        <div
          className="absolute top-0 left-0 h-full w-[40px] sm:w-[50px] bg-gradient-to-r from-[#121413] via-[#292D2B] to-[#121413] border-r-2 border-[#B9905A] transform -translate-x-1/2 rotateY-90 transform-style-3d flex flex-col justify-between items-center py-10 shadow-2xl"
          style={{
            transform: 'translateX(-25px) rotateY(-90deg)',
          }}
        >
          <div className="w-full h-1 bg-[#B9905A]" />
          <span className="text-[#B9905A] font-serif tracking-widest text-xs sm:text-sm uppercase writing-mode-vertical transform rotate-180 opacity-90">
            TEACHERS' DAY 2026 — HALL OF FAME
          </span>
          <div className="w-full h-1 bg-[#B9905A]" />
        </div>

        {/* Back Cover */}
        <div className="absolute inset-0 rounded-r-xl bg-[#1A1D1B] border-4 border-[#B9905A] shadow-2xl flex flex-col justify-between p-8 transform-style-3d">
          <div className="absolute inset-2 border border-[#B9905A]/40 rounded-lg pointer-events-none" />
          <div className="text-center font-serif text-[#B9905A] text-xs opacity-60">
            COMPUTER SCIENCE & ENGINEERING — SEC D
          </div>
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#B9905A] flex items-center justify-center text-[#B9905A] font-serif text-xl">
              2026
            </div>
          </div>
        </div>

        {/* Page Block Thickness (Right edge pages stack) */}
        <div
          className="absolute top-3 right-0 h-[calc(100%-24px)] w-[24px] sm:w-[32px] bg-gradient-to-r from-[#EFE6CA] via-[#E2D5B5] to-[#D5C4A1] border-y border-r border-[#B9905A]/40 shadow-inner flex flex-col justify-around py-4"
          style={{
            transform: 'translateX(12px) rotateY(90deg)',
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-full h-[1px] bg-[#B9905A]/20" />
          ))}
        </div>

        {/* Inner Paper Pages Stack */}
        <div className="absolute inset-y-3 left-6 right-3 rounded-r-md bg-[#EFE6CA] shadow-2xl p-6 sm:p-10 flex flex-col justify-between text-[#292D2B] border-l-4 border-[#B9905A]/60 transform-style-3d">
          {/* Subtle paper watermark grid */}
          <div className="absolute inset-0 bg-paper-texture opacity-30 pointer-events-none rounded-r-md" />

          {/* Page Header */}
          <div className="flex justify-between items-center border-b border-[#B9905A]/40 pb-3 relative z-10">
            <span className="font-serif text-xs uppercase tracking-widest text-[#B95F46]">
              DIGITAL MEMORY BOOK
            </span>
            <span className="font-serif italic text-xs text-[#44636A]">
              SECTION D • CLASS OF 2026
            </span>
          </div>

          {/* Page Content Viewport */}
          <div className="my-auto text-center space-y-4 relative z-10">
            <div className="w-12 h-0.5 bg-[#B9905A] mx-auto" />
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#292D2B] leading-tight">
              {activeChapterTitle}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#44636A] italic max-w-sm mx-auto">
              {activeChapterSubtitle}
            </p>
            <div className="w-12 h-0.5 bg-[#B9905A] mx-auto" />
          </div>

          {/* Page Footer */}
          <div className="flex justify-between items-center border-t border-[#B9905A]/40 pt-3 relative z-10 text-[10px] text-[#292D2B]/70 font-serif">
            <span>TEACHERS' DAY 2026</span>
            <span>CHAPTER MEMORIES</span>
            <span>PAGE 01</span>
          </div>

          {/* Vintage Silk Ribbon Bookmark */}
          <div className="absolute top-0 right-12 w-4 h-[120%] bg-gradient-to-b from-[#B95F46] via-[#93442F] to-[#B95F46] shadow-md transform rotate-1 rounded-b-md z-20 pointer-events-none" />
        </div>

        {/* Front Cover (Rotates open smoothly around Y axis) */}
        <motion.div
          className="absolute inset-0 rounded-r-xl bg-gradient-to-br from-[#292D2B] via-[#1A1D1B] to-[#121413] border-4 border-[#B9905A] shadow-2xl flex flex-col justify-between p-6 sm:p-10 transform-style-3d origin-left z-30"
          style={{
            transform: `rotateY(${coverRotationY}deg)`,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Ornate Gold Border Line */}
          <div className="absolute inset-3 border-2 border-[#B9905A] rounded-lg pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="text-[#B9905A] text-xs font-serif">❖</span>
              <span className="text-[#B9905A] text-xs font-serif">❖</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B9905A] text-xs font-serif">❖</span>
              <span className="text-[#B9905A] text-xs font-serif">❖</span>
            </div>
          </div>

          {/* Corner Brass Protectors */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#B9905A] rounded-tr-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#B9905A] rounded-br-lg" />

          {/* Cover Header */}
          <div className="text-center space-y-1 relative z-10 pt-4">
            <p className="text-[#B9905A] font-serif text-xs tracking-widest uppercase">
              HALL OF FAME
            </p>
            <p className="text-[#EFE6CA]/70 text-[10px] tracking-widest uppercase">
              CSE SECTION D • 2026
            </p>
          </div>

          {/* Cover Central Gold Embossing */}
          <div className="text-center space-y-4 my-auto relative z-10 px-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border-2 border-[#B9905A] flex items-center justify-center bg-[#292D2B]/80 shadow-lg">
              <span className="font-serif text-3xl sm:text-4xl text-[#B9905A]">❖</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide text-[#EFE6CA] drop-shadow-md">
              TEACHERS' DAY
            </h1>
            <p className="font-serif italic text-sm sm:text-base text-[#B9905A]">
              Interactive Digital Memory Book
            </p>
          </div>

          {/* Cover Footer */}
          <div className="text-center space-y-1 relative z-10 pb-2">
            <div className="w-24 h-0.5 bg-[#B9905A]/60 mx-auto mb-2" />
            <p className="text-[#EFE6CA]/80 font-serif text-xs tracking-widest">
              "SOME MOMENTS BECOME FOREVER"
            </p>
          </div>

          {/* Electric Glow Aura when closed at ending */}
          {isBookClosed && (
            <motion.div
              className="absolute inset-0 rounded-xl border-4 border-[#B9905A] pointer-events-none animate-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
