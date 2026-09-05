import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface LetterSwapProps {
  text: string;
  className?: string;
  staggerInterval?: number;
  flipDirection?: 'top' | 'bottom';
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  triggerOnce?: boolean;
}

export const LetterSwap: React.FC<LetterSwapProps> = ({
  text,
  className = '',
  staggerInterval = 0.035,
  flipDirection = 'top',
  as: Component = 'span',
  triggerOnce = true,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: triggerOnce, amount: 0.05 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 640);
    }
  }, []);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Essential safety fallback: ensure hero heading is never stuck invisible on mobile browsers
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  const words = text.split(' ');
  // On mobile, bypass rotateX (avoid iOS WebKit 3D flattening bug with overflow:hidden)
  const rotateXInit = isMobile ? 0 : (flipDirection === 'top' ? 90 : -90);

  let globalCharIndex = 0;

  return (
    <Component
      ref={ref as any}
      className={`inline-block select-none ${className}`}
      style={{ perspective: isMobile ? 'none' : '1000px' }}
      aria-label={text}
    >
      {words.map((word, wordIdx) => {
        const chars = word.split('');
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em] overflow-visible">
            {chars.map((char, charIdx) => {
              const delay = globalCharIndex * staggerInterval;
              globalCharIndex++;

              return (
                <span
                  key={charIdx}
                  className="inline-block relative overflow-hidden"
                  style={{ transformStyle: isMobile ? 'flat' : 'preserve-3d' }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{
                      opacity: 0,
                      rotateX: rotateXInit,
                      y: flipDirection === 'top' ? -10 : 10,
                    }}
                    animate={
                      hasAnimated
                        ? {
                            opacity: 1,
                            rotateX: 0,
                            y: 0,
                          }
                        : {
                            opacity: 0,
                            rotateX: rotateXInit,
                            y: flipDirection === 'top' ? -10 : 10,
                          }
                    }
                    transition={{
                      duration: 0.55,
                      delay,
                      ease: [0.22, 1, 0.36, 1], // power3.out
                    }}
                    style={{
                      transformOrigin: flipDirection === 'top' ? '50% 100%' : '50% 0%',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
};
