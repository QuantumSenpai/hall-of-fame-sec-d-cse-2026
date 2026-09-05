import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SkewedCarouselItem {
  id: number | string;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
}

interface SkewedCarouselProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
}

export const SkewedCarousel: React.FC<SkewedCarouselProps> = ({
  items,
  renderItem,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [items]);

  const scrollBy = (offset: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Scroll Navigation Buttons */}
      <div className="flex items-center justify-end gap-3 mb-6 pr-2">
        <button
          onClick={() => scrollBy(-380)}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className={`p-2.5 rounded-full border transition-all duration-200 ${
            canScrollLeft
              ? 'bg-[#16130E] border-[#C9A05C]/40 text-[#F5EFE1] hover:bg-[#C9A05C] hover:text-[#0D0B08] hover:border-[#C9A05C]'
              : 'opacity-30 cursor-not-allowed border-white/10 text-white/40'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scrollBy(380)}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className={`p-2.5 rounded-full border transition-all duration-200 ${
            canScrollRight
              ? 'bg-[#16130E] border-[#C9A05C]/40 text-[#F5EFE1] hover:bg-[#C9A05C] hover:text-[#0D0B08] hover:border-[#C9A05C]'
              : 'opacity-30 cursor-not-allowed border-white/10 text-white/40'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Horizontal Skewed Track with 3D Perspective */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 snap-x no-scrollbar"
        style={{
          perspective: '1200px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="flex-shrink-0 snap-start transition-transform duration-300 hover:scale-[1.02] hover:-rotate-1"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};
