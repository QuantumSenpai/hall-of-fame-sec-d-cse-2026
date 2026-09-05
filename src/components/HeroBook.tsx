import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroContent } from '../types/index.ts';
import { HeroAmbientParticles } from './HeroAmbientParticles.tsx';

interface HeroBookProps {
  hero?: HeroContent;
  onOpenHighlightMedia?: () => void;
  className?: string;
}

const DEFAULT_BOOK_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

export const HeroBook: React.FC<HeroBookProps> = ({
  hero,
  onOpenHighlightMedia,
  className = '',
}) => {
  // Proportional book dimensions
  const pageWidth = 300;
  const pageHeight = 430;
  const spineWidth = 24;
  const totalBookWidth = pageWidth * 2 + spineWidth; // 624px

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      // Allow up to 90vw on mobile screens with padding
      const maxAvailable = Math.min(containerWidth, window.innerWidth * 0.90);
      const computedScale = Math.min(1.02, Math.max(0.42, maxAvailable / totalBookWidth));
      setScale(computedScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [totalBookWidth]);

  const bookImage = hero?.bookImage || DEFAULT_BOOK_IMAGE;
  const bookCaption = hero?.bookCaption || 'A moment of stillness & infinite gratitude';
  const quoteHeading = hero?.quoteHeading || 'Good Teachers\nBrighter Futures';
  const quoteSubtext = hero?.quoteSubtext || 'More than teachers, A family forever.';

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[90vw] sm:max-w-[560px] lg:max-w-[624px] mx-auto flex items-center justify-center overflow-hidden sm:overflow-visible select-none ${className}`}
      style={{
        height: Math.round(pageHeight * scale),
      }}
    >
      {/* Scaled Book Scene Wrapper */}
      <div
        className="relative flex items-center justify-center flex-shrink-0 transition-transform duration-200"
        style={{
          width: totalBookWidth,
          height: pageHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          perspective: '2200px',
          perspectiveOrigin: '50% 45%',
        }}
      >
        {/* 1. Subtle Ambient Particle Layer directly behind the book (18-24 slow drifting specks) */}
        <div className="absolute -inset-10 pointer-events-none z-0">
          <HeroAmbientParticles particleCount={20} />
        </div>

        {/* 2. Soft Ambient Radial Gradient behind book (gold & burgundy at low opacity) */}
        <div
          className="absolute -inset-14 pointer-events-none rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(201, 160, 92, 0.18) 0%, rgba(92, 31, 46, 0.11) 40%, transparent 72%)',
            zIndex: 1,
          }}
        />

      {/* 3. Table Cast Deep Shadow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -22,
          width: '96%',
          height: 76,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.65) 45%, transparent 78%)',
          filter: 'blur(18px)',
          borderRadius: '50%',
          transform: 'rotateX(55deg)',
          zIndex: 2,
        }}
      />

      {/* 4. Stacked Vintage Leather Books (Right Desk Accessory) */}
      <div
        className="absolute -right-3 -bottom-5 hidden lg:flex flex-col-reverse items-end pointer-events-none"
        style={{ zIndex: 3, transform: 'rotate(-4deg)' }}
      >
        {[
          { title: 'Guidance', color: '#1a140d', height: 28, width: 135 },
          { title: 'Friendship', color: '#261b11', height: 32, width: 145 },
          { title: 'Knowledge', color: '#160e08', height: 30, width: 154 },
          { title: 'Forever Grateful', color: '#2e1c10', height: 34, width: 162 },
        ].map((book, idx) => (
          <div
            key={idx}
            style={{
              height: book.height,
              width: book.width,
              background: `linear-gradient(to right, ${book.color} 0%, #3d2616 35%, ${book.color} 80%, #0d0704 100%)`,
              borderRadius: '3px 0 0 3px',
              boxShadow: 'inset 0 1px 1px rgba(201,160,92,0.35), inset 0 -1px 2px rgba(0,0,0,0.8), -3px 4px 8px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 12,
              marginBottom: -2,
              borderLeft: '1px solid rgba(201,160,92,0.4)',
              borderTop: '1px solid rgba(201,160,92,0.2)',
            }}
          >
            <span
              className="font-serif text-[11px] font-semibold tracking-widest text-[#C9A05C]/90 uppercase"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
            >
              {book.title}
            </span>
          </div>
        ))}
      </div>

      {/* 5. Fountain Pen resting in foreground */}
      <div
        className="absolute -bottom-1 left-4 sm:left-12 hidden sm:block pointer-events-none"
        style={{
          width: 165,
          height: 18,
          zIndex: 15,
          transform: 'rotate(-20deg)',
          filter: 'drop-shadow(0 12px 10px rgba(0,0,0,0.9))',
        }}
      >
        <div className="relative w-full h-full flex items-center">
          <div
            className="w-9 h-3.5 rounded-l-sm"
            style={{
              background: 'linear-gradient(to bottom, #d4af6a, #c9a05c, #85612f)',
              clipPath: 'polygon(0 50%, 100% 0, 100% 100%)',
            }}
          />
          <div
            className="flex-1 h-3.5 rounded-r-md"
            style={{
              background: 'linear-gradient(to bottom, #2b2b2b, #111111, #1c1c1c)',
              borderRight: '2px solid #c9a05c',
            }}
          />
        </div>
      </div>

      {/* 6. Main Open 3D Book Container with re-tuned luxury settle-in animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.91, y: 22 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(14deg) rotateY(-5deg) rotateZ(-1deg)',
          zIndex: 5,
        }}
      >
        {/* Leather Hardcover Underneath with warm gilded edge */}
        <div
          className="absolute -inset-3 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #28160c 0%, #150a05 45%, #241208 75%, #0e0502 100%)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), inset 0 0 14px rgba(0,0,0,0.95), 0 0 0 1px rgba(201,160,92,0.35)',
            zIndex: 1,
          }}
        />

        {/* LEFT PAGE (Calm Meditative / Nature Imagery with Mat-Board Frame) */}
        <div
          className="relative overflow-hidden flex flex-col p-4 sm:p-5"
          style={{
            width: pageWidth,
            height: pageHeight,
            borderRadius: '6px 0 0 6px',
            background: 'linear-gradient(108deg, #d8c7ae 0%, #eee4cf 25%, #f7efe0 60%, #eee4cf 85%, #dac9af 100%)',
            boxShadow: 'inset -18px 0 26px rgba(45,25,12,0.35), inset 2px 0 4px rgba(255,255,255,0.35), -5px 8px 18px rgba(0,0,0,0.55)',
            transform: 'rotateY(2deg)',
            transformOrigin: 'right center',
            zIndex: 5,
          }}
        >
          {/* Paper Grain Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'radial-gradient(#8b7355 0.75px, transparent 0.75px)',
              backgroundSize: '6px 6px',
            }}
          />

          {/* Mat-board Framed Photo */}
          <div
            onClick={onOpenHighlightMedia}
            className="relative w-full h-full rounded cursor-pointer overflow-hidden group transition-all duration-300"
            style={{
              padding: '12px 12px 38px 12px',
              background: 'linear-gradient(135deg, #FBF8EE 0%, #F1ECE0 50%, #E8E1D2 100%)',
              border: '1px solid rgba(201, 160, 92, 0.45)',
              boxShadow:
                '0 10px 28px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.85), inset 0 -1px 2px rgba(100,70,30,0.18)',
            }}
          >
            <div className="relative w-full h-full rounded-sm overflow-hidden shadow-inner bg-[#1A1D1B]">
              <img
                src={bookImage}
                alt="Reflective Stillness"
                className="w-full h-full object-cover filter saturate-[0.88] brightness-[0.94] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#C9A05C]/10 mix-blend-multiply pointer-events-none" />
            </div>

            {/* Handwritten Polaroid Caption on Left Mat-Board */}
            <div className="absolute bottom-2.5 inset-x-0 text-center px-2">
              <span className="font-hand text-xs sm:text-sm text-[#4E2B15] font-semibold truncate block">
                {bookCaption}
              </span>
            </div>
          </div>
        </div>

        {/* CENTRAL SPINE (Deeper shadow + gold stitching) */}
        <div
          className="relative flex flex-col justify-between items-center py-5"
          style={{
            width: spineWidth,
            height: pageHeight,
            background: 'linear-gradient(to right, #2c1407 0%, #170702 35%, #0a0301 50%, #170702 65%, #2c1407 100%)',
            boxShadow: 'inset 0 0 14px rgba(0,0,0,0.95), -10px 0 18px rgba(0,0,0,0.9), 10px 0 18px rgba(0,0,0,0.9)',
            zIndex: 10,
          }}
        >
          {/* Spine Crease Line */}
          <div className="absolute inset-y-0 w-px bg-[#C9A05C]/45 shadow-[0_0_4px_rgba(0,0,0,0.9)]" />
          
          {/* Gold Stitch Accents */}
          <div className="w-4 h-1.5 bg-gradient-to-r from-[#85612f] via-[#d4af6a] to-[#85612f] rounded-full opacity-85" />
          <div className="w-4 h-1.5 bg-gradient-to-r from-[#85612f] via-[#d4af6a] to-[#85612f] rounded-full opacity-85" />
          <div className="w-4 h-1.5 bg-gradient-to-r from-[#85612f] via-[#d4af6a] to-[#85612f] rounded-full opacity-85" />
        </div>

        {/* RIGHT PAGE (Parchment with rich grain & calligraphy) */}
        <div
          className="relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-7 text-center"
          style={{
            width: pageWidth,
            height: pageHeight,
            borderRadius: '0 6px 6px 0',
            background: 'linear-gradient(72deg, #dac9af 0%, #eee4cf 15%, #f7efe0 45%, #eee4cf 85%, #d8c7ae 100%)',
            boxShadow: 'inset 18px 0 26px rgba(45,25,12,0.3), inset -2px 0 4px rgba(255,255,255,0.25), 5px 8px 18px rgba(0,0,0,0.55)',
            transform: 'rotateY(-2deg)',
            transformOrigin: 'left center',
            zIndex: 5,
          }}
        >
          {/* Paper Grain Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'radial-gradient(#8b7355 0.75px, transparent 0.75px)',
              backgroundSize: '6px 6px',
            }}
          />

          {/* Subtle Ledger Lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 20px, rgba(139,115,85,0.25) 20px, rgba(139,115,85,0.25) 21px)',
            }}
          />

          {/* Double Gold Decorative Border */}
          <div className="absolute inset-3.5 border-2 border-dashed border-[#C9A05C]/35 rounded-sm pointer-events-none" />
          <div className="absolute inset-4.5 border border-[#C9A05C]/20 rounded-sm pointer-events-none" />

          {/* Calligraphic Inscription */}
          <div className="relative z-10 w-full px-2">
            <div className="w-14 h-px bg-gradient-to-r from-transparent via-[#C9A05C]/70 to-transparent mx-auto mb-3.5" />
            
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#8b5a2b] font-semibold mb-2.5">
              SECTION D • CSE 2026
            </p>

            <h2 className="font-hand text-3xl sm:text-4xl lg:text-[42px] text-[#241207] font-bold leading-tight mb-2.5 drop-shadow-sm whitespace-pre-line">
              {quoteHeading}
            </h2>

            <div className="flex items-center justify-center my-2 text-[#5C1F2E] text-2xl">
              ♥
            </div>

            <div className="w-14 h-px bg-gradient-to-r from-transparent via-[#C9A05C]/70 to-transparent mx-auto mb-3.5" />

            <p className="font-hand text-lg sm:text-xl text-[#351a0b] leading-snug whitespace-pre-line">
              {quoteSubtext}
            </p>

            {/* Subtle Bookmark Ribbon Tail */}
            <div
              className="absolute -bottom-11 left-1/2 -translate-x-1/2 w-4 h-14 bg-gradient-to-b from-[#5C1F2E] to-[#380e18] shadow-md"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  </div>
  );
};
