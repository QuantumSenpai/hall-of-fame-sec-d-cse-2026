import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion';
import { ChevronRight, Maximize2 } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================
export interface ChapterData {
  id: string;
  num: string;
  category: string;
  title: string;
  description: string;
  linkText: string;
  image: string;
  overlayLines: string[];
}

export interface PhysicalBookProps {
  mode?: 'hero' | 'interactive';
  activeChapter?: ChapterData;
  chapterIndex?: number;
  totalChapters?: number;
  onOpenMedia?: (mediaUrl: string) => void;
  onIntroComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// ============================================================
// STACKED BOOKS (HERO BACKGROUND ACCESSORY)
// As shown in the reference image on the right side behind the book
// ============================================================
export const StackedBooksAccessory: React.FC = () => {
  const books = [
    { title: 'Guidance', color: '#3a170e', height: 28, width: 140 },
    { title: 'Friendship', color: '#2b1008', height: 32, width: 148 },
    { title: 'Knowledge', color: '#441d12', height: 30, width: 154 },
    { title: 'Better Humans', color: '#240c06', height: 34, width: 160 },
    { title: 'Forever Grateful', color: '#33150b', height: 36, width: 166 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        right: '-32px',
        bottom: '24px',
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 2,
        transform: 'rotate(-4deg)',
      }}
    >
      {books.map((book, idx) => (
        <div
          key={book.title}
          style={{
            height: book.height,
            width: book.width,
            background: `linear-gradient(to right, ${book.color} 0%, #4a2214 30%, ${book.color} 75%, #180804 100%)`,
            borderRadius: '3px 0 0 3px',
            boxShadow: 'inset 0 1px 1px rgba(201,164,99,0.3), inset 0 -1px 2px rgba(0,0,0,0.8), -3px 4px 10px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: 16,
            marginBottom: -2,
            borderLeft: '1px solid rgba(201,164,99,0.4)',
            borderTop: '1px solid rgba(201,164,99,0.2)',
          }}
        >
          <span
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(201,164,99,0.85)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textShadow: '0 1px 2px rgba(0,0,0,0.9)',
            }}
          >
            {book.title}
          </span>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// FOUNTAIN PEN (HERO DESK ACCESSORY)
// As shown in the reference image resting at an angle on the desk
// ============================================================
export const VintageFountainPen: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: 170,
        height: 18,
        pointerEvents: 'none',
        zIndex: 10,
        transform: 'rotate(-22deg)',
        filter: 'drop-shadow(0 14px 10px rgba(0,0,0,0.85))',
        ...style,
      }}
    >
      {/* Pen Body */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Nib (Gold) */}
        <div
          style={{
            width: 24,
            height: 10,
            background: 'linear-gradient(to right, #e2c27e, #c9a463 60%, #8a6a2c)',
            clipPath: 'polygon(0% 50%, 100% 0%, 85% 50%, 100% 100%)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
          }}
        />
        {/* Grip Section */}
        <div
          style={{
            width: 18,
            height: 11,
            background: 'linear-gradient(to bottom, #2a2a2a, #0a0a0a)',
            borderRadius: '1px',
          }}
        />
        {/* Gold Ring */}
        <div
          style={{
            width: 4,
            height: 13,
            background: 'linear-gradient(to bottom, #f5e4b8, #c9a463 60%, #8a6a2c)',
          }}
        />
        {/* Pen Barrel (Deep Burgundy / Black Lacquer) */}
        <div
          style={{
            flex: 1,
            height: 13,
            background: 'linear-gradient(to bottom, #4a151b 0%, #2b0c10 40%, #150507 80%, #300d12 100%)',
            borderRadius: '0 4px 4px 0',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -1px 2px rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 6,
          }}
        >
          {/* Gold end cap */}
          <div
            style={{
              width: 5,
              height: 11,
              background: 'linear-gradient(to bottom, #f5e4b8, #c9a463)',
              borderRadius: '0 2px 2px 0',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MULTI-LAYER PAGE BLOCK (THICKNESS)
// Creates authentic physical book page stack thickness
// ============================================================
export const PageStackBlock: React.FC<{ side: 'left' | 'right'; thickness?: number }> = ({
  side,
  thickness = 18,
}) => {
  const isLeft = side === 'left';

  return (
    <div
      style={{
        position: 'absolute',
        top: 4,
        bottom: 4,
        [isLeft ? 'left' : 'right']: -thickness + 2,
        width: thickness,
        background: isLeft
          ? 'linear-gradient(to left, #dcd0ba 0%, #c9ba9e 40%, #a8987b 80%, #7d6e53 100%)'
          : 'linear-gradient(to right, #dcd0ba 0%, #c9ba9e 40%, #a8987b 80%, #7d6e53 100%)',
        borderRadius: isLeft ? '3px 0 0 3px' : '0 3px 3px 0',
        boxShadow: isLeft
          ? 'inset 1px 0 2px rgba(255,255,255,0.2), -4px 6px 14px rgba(0,0,0,0.65)'
          : 'inset -1px 0 2px rgba(255,255,255,0.2), 4px 6px 14px rgba(0,0,0,0.65)',
        transformStyle: 'preserve-3d',
        transform: isLeft
          ? 'rotateY(-60deg) translateX(-4px)'
          : 'rotateY(60deg) translateX(4px)',
        transformOrigin: isLeft ? 'right center' : 'left center',
        zIndex: 1,
      }}
    >
      {/* Stratified fine paper lines simulation */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent, transparent 1.8px, rgba(90,70,45,0.3) 1.8px, rgba(90,70,45,0.3) 2.5px)',
          opacity: 0.85,
        }}
      />
    </div>
  );
};

// ============================================================
// BOTTOM PAGE BLOCK THICKNESS
// ============================================================
export const BottomPageBlock: React.FC<{ side: 'left' | 'right'; thickness?: number }> = ({
  side,
  thickness = 16,
}) => {
  const isLeft = side === 'left';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: -thickness + 2,
        left: isLeft ? 6 : 0,
        right: isLeft ? 0 : 6,
        height: thickness,
        background: 'linear-gradient(to bottom, #dcd0ba 0%, #b8a78a 60%, #705f42 100%)',
        transform: 'rotateX(-70deg)',
        transformOrigin: 'top center',
        borderRadius: isLeft ? '0 0 0 3px' : '0 0 3px 0',
        boxShadow: '0 8px 16px rgba(0,0,0,0.8)',
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(to right, transparent, transparent 2.5px, rgba(90,70,45,0.35) 2.5px, rgba(90,70,45,0.35) 3.2px)',
          opacity: 0.8,
        }}
      />
    </div>
  );
};

// ============================================================
// SILK RIBBON BOOKMARK
// ============================================================
export const SilkRibbon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: -6,
        right: 48,
        width: 18,
        height: 120,
        background: 'linear-gradient(to bottom, #540e13 0%, #8b1c24 35%, #aa2530 65%, #6a141b 100%)',
        boxShadow: '3px 6px 12px rgba(0,0,0,0.6), inset 1px 0 2px rgba(255,255,255,0.25)',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 86%, 50% 100%, 0% 86%)',
        zIndex: 35,
        transformOrigin: 'top center',
        transform: 'rotate(2.5deg)',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Satin sheen reflection */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 4,
          width: 3,
          bottom: 18,
          background: 'rgba(255,255,255,0.2)',
          filter: 'blur(0.5px)',
        }}
      />
    </div>
  );
};

// ============================================================
// PHOTO TAPE CORNERS
// Vintage washi tape holding photo corners onto parchment
// ============================================================
export const TapeCorner: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br' }> = ({ position }) => {
  const posMap = {
    tl: { top: -6, left: -6, transform: 'rotate(-38deg)' },
    tr: { top: -6, right: -6, transform: 'rotate(38deg)' },
    bl: { bottom: -6, left: -6, transform: 'rotate(38deg)' },
    br: { bottom: -6, right: -6, transform: 'rotate(-38deg)' },
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: 32,
        height: 13,
        backgroundColor: 'rgba(224, 210, 180, 0.72)',
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(180,150,110,0.3) 100%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(1px)',
        borderRadius: '1px',
        zIndex: 5,
        pointerEvents: 'none',
        ...posMap[position],
      }}
    />
  );
};

// ============================================================
// HARDCOVER BASE / BACK COVER (LEATHER)
// ============================================================
export const LeatherCoverBase: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: -12,
        bottom: -14,
        left: -14,
        right: -14,
        background: 'linear-gradient(135deg, #240c06 0%, #3a150b 45%, #180602 100%)',
        borderRadius: 10,
        boxShadow: `
          0 25px 60px -10px rgba(0,0,0,0.95),
          0 40px 90px rgba(0,0,0,0.8),
          inset 0 0 0 2px rgba(201,164,99,0.35),
          inset 0 0 0 5px rgba(28,10,4,0.95),
          inset 0 0 0 6px rgba(201,164,99,0.2)
        `,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Corner brass braces */}
      {[['top-2 left-2', 'rounded-tl-md'], ['top-2 right-2', 'rounded-tr-md'], ['bottom-2 left-2', 'rounded-bl-md'], ['bottom-2 right-2', 'rounded-br-md']].map(([pos, rad], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: pos.includes('top') ? 6 : 'auto',
            bottom: pos.includes('bottom') ? 6 : 'auto',
            left: pos.includes('left') ? 6 : 'auto',
            right: pos.includes('right') ? 6 : 'auto',
            width: 22,
            height: 22,
            border: '2px solid rgba(201,164,99,0.5)',
            borderTopColor: pos.includes('top') ? 'rgba(201,164,99,0.8)' : 'transparent',
            borderBottomColor: pos.includes('bottom') ? 'rgba(201,164,99,0.8)' : 'transparent',
            borderLeftColor: pos.includes('left') ? 'rgba(201,164,99,0.8)' : 'transparent',
            borderRightColor: pos.includes('right') ? 'rgba(201,164,99,0.8)' : 'transparent',
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// FRONT COVER (FOR CLOSED INTRO / CLOSING SEQUENCE)
// Vintage dark leather with gold embossing
// ============================================================
export const VintageFrontCover: React.FC<{
  width: number;
  height: number;
  rotationY: MotionValue<number> | number;
  isClosed?: boolean;
}> = ({ width, height, rotationY, isClosed = false }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: width,
        height: height,
        borderRadius: '0 8px 8px 0',
        background: 'linear-gradient(140deg, #2c1007 0%, #421a0d 40%, #1e0904 85%, #2a0e06 100%)',
        boxShadow: 'inset 0 0 0 2px rgba(201,164,99,0.5), inset 0 0 0 6px #240c06, inset 0 0 0 8px rgba(201,164,99,0.25), 10px 18px 45px rgba(0,0,0,0.85)',
        transformOrigin: 'left center',
        transformStyle: 'preserve-3d',
        rotateY: rotationY,
        backfaceVisibility: 'hidden',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px 28px',
      }}
    >
      {/* Filigree Inner Border */}
      <div
        style={{
          position: 'absolute',
          inset: 14,
          border: '1.5px solid rgba(201,164,99,0.4)',
          borderRadius: 4,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 18,
          border: '1px dashed rgba(201,164,99,0.25)',
          borderRadius: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Four Corner Fleurons */}
      {[['top-5 left-5'], ['top-5 right-5'], ['bottom-5 left-5'], ['bottom-5 right-5']].map(([pos], i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: pos.includes('top') ? 22 : 'auto',
            bottom: pos.includes('bottom') ? 22 : 'auto',
            left: pos.includes('left') ? 22 : 'auto',
            right: pos.includes('right') ? 22 : 'auto',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 16,
            color: 'rgba(201,164,99,0.85)',
            lineHeight: 1,
          }}
        >
          ❖
        </span>
      ))}

      {/* Cover Header */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 9,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(201,164,99,0.7)',
            margin: 0,
          }}
        >
          SECTION D • CSE 2026
        </p>
      </div>

      {/* Cover Center Medallion & Title */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 8px' }}>
        {/* Gold Emblem */}
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 16px',
            borderRadius: '50%',
            border: '1.5px solid rgba(201,164,99,0.6)',
            boxShadow: 'inset 0 0 10px rgba(201,164,99,0.2), 0 0 15px rgba(201,164,99,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, #38150a 0%, #1a0803 100%)',
          }}
        >
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: '#c9a463' }}>
            ✦
          </span>
        </div>

        {/* Embossed Main Title */}
        <h2
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            color: '#f2e8d5',
            textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 12px rgba(201,164,99,0.35)',
            margin: '0 0 8px',
          }}
        >
          HALL OF MEMORIES
        </h2>

        {/* Gold Divider */}
        <div
          style={{
            width: 50,
            height: 1,
            background: 'linear-gradient(to right, transparent, rgba(201,164,99,0.8), transparent)',
            margin: '10px auto',
          }}
        />

        <p
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 15,
            fontStyle: 'italic',
            letterSpacing: '0.12em',
            color: '#c9a463',
            margin: 0,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          TEACHERS' DAY 2026
        </p>
      </div>

      {/* Cover Footer */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <p
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 16,
            color: 'rgba(242,232,213,0.7)',
            margin: 0,
          }}
        >
          Forever in our hearts ♡
        </p>
      </div>
    </motion.div>
  );
};

// ============================================================
// MAIN PHYSICAL 3D BOOK COMPONENT (HERO SPREAD)
// Perfectly matches reference image
// ============================================================
export const PhysicalBookHero: React.FC<{
  onIntroComplete?: () => void;
  onWatchHighlight?: () => void;
  onOpenMedia?: (url: string) => void;
}> = ({ onIntroComplete, onWatchHighlight, onOpenMedia }) => {
  const [animationStep, setAnimationStep] = useState<'entering' | 'opening' | 'settled'>('entering');

  const pageWidth = 285;
  const pageHeight = 425;
  const spineWidth = 24;

  const handleAnimationComplete = () => {
    if (animationStep === 'entering') {
      setAnimationStep('opening');
    }
  };

  useEffect(() => {
    if (animationStep === 'opening') {
      const timer = setTimeout(() => {
        setAnimationStep('settled');
        if (onIntroComplete) onIntroComplete();
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [animationStep, onIntroComplete]);

  return (
    <div
      className="book-scene"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 640,
        height: pageHeight + 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '2800px',
        perspectiveOrigin: '50% 45%',
      }}
    >
      {/* Atmospheric warm table spotlight */}
      <div
        style={{
          position: 'absolute',
          inset: '-25% -35%',
          background: 'radial-gradient(ellipse at 48% 44%, rgba(201,164,99,0.12) 0%, rgba(61,21,21,0.06) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Table Ambient Cast Shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          width: '92%',
          height: 80,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(4,1,2,0.92) 0%, rgba(4,1,2,0.65) 45%, transparent 75%)',
          filter: 'blur(20px)',
          borderRadius: '50%',
          transform: 'rotateX(45deg) translateY(24px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Stacked Leather Books on the Right Desk */}
      <StackedBooksAccessory />

      {/* Fountain Pen resting in foreground */}
      <VintageFountainPen style={{ bottom: 18, left: '22%' }} />

      {/* 3D BOOK CONTAINER */}
      <motion.div
        initial={{
          scale: 0.45,
          rotateY: 360,
          rotateX: 25,
          z: -600,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          rotateY: -8,
          rotateX: 16,
          rotateZ: -1.5,
          z: 0,
          opacity: 1,
        }}
        transition={{
          rotateY: { duration: 2.1, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 2.1, ease: [0.22, 1, 0.36, 1] },
          rotateX: { duration: 2.1, ease: [0.22, 1, 0.36, 1] },
          rotateZ: { duration: 2.1, ease: [0.22, 1, 0.36, 1] },
          z: { duration: 2.1, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.6, ease: 'easeIn' },
        }}
        onAnimationComplete={handleAnimationComplete}
        style={{
          position: 'relative',
          display: 'flex',
          transformStyle: 'preserve-3d',
          zIndex: 5,
        }}
      >
        {/* Leather Hardcover Underneath */}
        <LeatherCoverBase width={pageWidth * 2 + spineWidth} height={pageHeight} />

        {/* Page Block Stack Thickness */}
        <PageStackBlock side="left" thickness={18} />
        <PageStackBlock side="right" thickness={18} />
        <BottomPageBlock side="left" thickness={16} />
        <BottomPageBlock side="right" thickness={16} />

        {/* LEFT PAGE (PARCHMENT + EDITORIAL LETTERING) */}
        <div
          style={{
            position: 'relative',
            width: pageWidth,
            height: pageHeight,
            borderRadius: '6px 0 0 6px',
            background: 'linear-gradient(110deg, #d3c0a2 0%, #ede0c7 28%, #f6edd8 62%, #ede0c7 88%, #d8c6a9 100%)',
            boxShadow: 'inset -14px 0 24px rgba(45,25,12,0.35), inset 2px 0 6px rgba(255,255,255,0.2), -3px 4px 12px rgba(0,0,0,0.5)',
            transform: 'rotateY(2deg)',
            transformOrigin: 'right center',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px 24px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent, transparent 19px, rgba(139,115,85,0.08) 19px, rgba(139,115,85,0.08) 20px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              boxShadow: 'inset 0 0 30px rgba(160,120,70,0.22)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 14,
              border: '2px double rgba(139,100,50,0.42)',
              borderRadius: 3,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 20,
              border: '1px solid rgba(139,100,50,0.18)',
              borderRadius: 2,
              pointerEvents: 'none',
            }}
          />

          {/* Corner Flourishes */}
          {[['top-[24px] left-[24px]', '12px 0 0 0'], ['top-[24px] right-[24px]', '0 12px 0 0'], ['bottom-[24px] left-[24px]', '0 0 0 12px'], ['bottom-[24px] right-[24px]', '0 0 12px 0']].map(([pos, rad], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: pos.includes('top') ? 24 : 'auto',
                bottom: pos.includes('bottom') ? 24 : 'auto',
                left: pos.includes('left') ? 24 : 'auto',
                right: pos.includes('right') ? 24 : 'auto',
                width: 16,
                height: 16,
                border: '1px solid rgba(139,100,50,0.4)',
                borderRadius: rad,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Left Page Content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
            <div
              style={{
                width: 38,
                height: 1,
                background: 'linear-gradient(to right, transparent, rgba(120,80,35,0.55), transparent)',
                margin: '0 auto 14px',
              }}
            />

            <h2
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 34,
                lineHeight: 1.2,
                color: '#2e190a',
                margin: '0 0 10px',
                fontWeight: 600,
                textShadow: '0 1px 1px rgba(255,255,255,0.4)',
              }}
            >
              Good<br />
              Teachers<br />
              Brighter<br />
              Futures
            </h2>

            <div style={{ margin: '8px auto', display: 'flex', justifyContent: 'center' }}>
              <span style={{ color: '#9e2424', fontSize: 18 }}>♥</span>
            </div>

            <div
              style={{
                width: 38,
                height: 1,
                background: 'linear-gradient(to right, transparent, rgba(120,80,35,0.55), transparent)',
                margin: '10px auto 14px',
              }}
            />

            <p
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 18,
                color: '#4a2d16',
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              More than teachers,<br />
              <span style={{ color: '#8a2828', fontWeight: 600 }}>A family ♡</span>
            </p>
          </div>

          <SilkRibbon />
        </div>

        {/* CENTRAL SPINE */}
        <div
          style={{
            position: 'relative',
            width: spineWidth,
            height: pageHeight,
            background: 'linear-gradient(to right, #482410 0%, #291206 35%, #180702 50%, #291206 65%, #482410 100%)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.85), -6px 0 14px rgba(0,0,0,0.8), 6px 0 14px rgba(0,0,0,0.8)',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(201,164,99,0.35)',
              boxShadow: '0 0 3px rgba(0,0,0,0.9)',
            }}
          />
          <div style={{ width: '80%', height: 3, background: 'linear-gradient(to right, #8a6a2c, #e2c27e, #8a6a2c)', borderRadius: 1 }} />
          <div style={{ width: '80%', height: 3, background: 'linear-gradient(to right, #8a6a2c, #e2c27e, #8a6a2c)', borderRadius: 1 }} />
        </div>

        {/* RIGHT PAGE (PASTED PHOTO) */}
        <div
          style={{
            position: 'relative',
            width: pageWidth,
            height: pageHeight,
            borderRadius: '0 6px 6px 0',
            background: 'linear-gradient(70deg, #d8c6a9 0%, #ede0c7 15%, #f6edd8 45%, #ede0c7 85%, #d3c0a2 100%)',
            boxShadow: 'inset 14px 0 24px rgba(45,25,12,0.3), inset -2px 0 6px rgba(255,255,255,0.15), 3px 4px 12px rgba(0,0,0,0.5)',
            transform: 'rotateY(-2deg)',
            transformOrigin: 'left center',
            overflow: 'hidden',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent, transparent 19px, rgba(139,115,85,0.08) 19px, rgba(139,115,85,0.08) 20px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              boxShadow: 'inset 0 0 30px rgba(160,120,70,0.22)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)',
              border: '4px solid #fcfaf4',
              cursor: 'pointer',
            }}
            onClick={() =>
              onOpenMedia &&
              onOpenMedia('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80')
            }
          >
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
              alt="Teachers' Day 2026 Celebration"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'sepia(20%) saturate(0.9) brightness(0.86)',
                transition: 'transform 0.6s ease',
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(60,20,15,0.16)',
                mixBlendMode: 'multiply',
                pointerEvents: 'none',
              }}
            />

            <TapeCorner position="tl" />
            <TapeCorner position="tr" />
            <TapeCorner position="bl" />
            <TapeCorner position="br" />

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px 12px 10px',
                background: 'linear-gradient(to top, rgba(14,4,7,0.85) 0%, rgba(14,4,7,0.5) 60%, transparent 100%)',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 15,
                  color: '#f6edd8',
                  margin: 0,
                  textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                }}
              >
                September 2026 — A day to remember ♡
              </p>
            </div>
          </div>
        </div>

        {/* FRONT COVER FOR INITIAL OPENING FLIP */}
        {animationStep !== 'settled' && (
          <motion.div
            initial={{ rotateY: 0 }}
            animate={animationStep === 'opening' ? { rotateY: -180 } : { rotateY: 0 }}
            transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: pageWidth,
              height: pageHeight,
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              zIndex: 40,
            }}
          >
            <VintageFrontCover
              width={pageWidth}
              height={pageHeight}
              rotationY={0}
              isClosed={animationStep === 'entering'}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export interface BookShellProps {
  children: React.ReactNode;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: MotionValue<number> | number;
  style?: React.CSSProperties;
}

export const BookShell: React.FC<BookShellProps> = ({
  children,
  perspective = 2800,
  rotateX = 14,
  rotateY = -6,
  rotateZ = -1,
  scale = 1,
  style,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 45%',
        ...style,
      }}
    >
      <motion.div
        style={{
          scale,
          position: 'relative',
          display: 'flex',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const BookCover: React.FC<{
  width: number;
  height: number;
  spineWidth: number;
  frontRotationY?: MotionValue<number> | number;
  isClosed?: boolean;
}> = ({ width, height, spineWidth, frontRotationY = 0, isClosed = false }) => {
  return (
    <>
      <LeatherCoverBase width={width * 2 + spineWidth} height={height} />
      {frontRotationY !== undefined && (
        <VintageFrontCover
          width={width}
          height={height}
          rotationY={frontRotationY}
          isClosed={isClosed}
        />
      )}
    </>
  );
};

export const PageStack: React.FC<{ side: 'left' | 'right'; thickness?: number }> = ({
  side,
  thickness = 20,
}) => {
  return (
    <>
      <PageStackBlock side={side} thickness={thickness} />
      <BottomPageBlock side={side} thickness={thickness - 2} />
    </>
  );
};

// ============================================================
// CONTENT TEMPLATES: EDITORIAL LEFT & PASTED MEDIA RIGHT
// ============================================================
export const LeftPageContent: React.FC<{
  chapter: ChapterData;
  index: number;
  onLinkClick?: () => void;
}> = ({ chapter, index, onLinkClick }) => {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '34px 28px',
      }}
    >
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 16,
              fontWeight: 700,
              color: '#8b3a2a',
              letterSpacing: '0.12em',
            }}
          >
            CHAPTER {chapter.num}
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 8.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(120,80,35,0.8)',
            }}
          >
            {chapter.category}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: 1,
            background: 'linear-gradient(to right, rgba(139,100,50,0.5), transparent)',
            marginTop: 8,
          }}
        />
      </div>

      {/* Main Story Editorial */}
      <div style={{ margin: 'auto 0' }}>
        <h2
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 800,
            fontSize: 28,
            lineHeight: 1.15,
            color: '#281308',
            margin: '0 0 12px',
            whiteSpace: 'pre-line',
          }}
        >
          {chapter.title}
        </h2>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12.5,
            lineHeight: 1.7,
            color: '#4a3220',
            margin: '0 0 16px',
            whiteSpace: 'pre-line',
          }}
        >
          {chapter.description}
        </p>

        {/* Handwritten editorial note */}
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(201,164,99,0.12)',
            borderRadius: 4,
            borderLeft: '2px solid rgba(139,100,50,0.5)',
          }}
        >
          <p
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 16,
              color: '#5a3014',
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            "A memory made together, etched forever in our hearts."
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onLinkClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#8b3a2a',
            fontWeight: 600,
            padding: 0,
          }}
        >
          {chapter.linkText}
          <ChevronRight size={13} />
        </button>

        <span
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 11,
            color: 'rgba(120,80,35,0.7)',
            fontStyle: 'italic',
          }}
        >
          Page 0{index * 2 + 1}
        </span>
      </div>
    </div>
  );
};

export const RightPageContent: React.FC<{
  chapter: ChapterData;
  onMediaClick?: () => void;
}> = ({ chapter, onMediaClick }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Pasted Photograph Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4)',
          border: '5px solid #faf7f0',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={onMediaClick}
      >
        <img
          src={chapter.image}
          alt={chapter.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'sepia(25%) saturate(0.85) brightness(0.88)',
            transition: 'transform 0.5s ease',
          }}
        />

        {/* Warm photo tint */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(60,20,15,0.15)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />

        {/* 4 Corner Tape */}
        <TapeCorner position="tl" />
        <TapeCorner position="tr" />
        <TapeCorner position="bl" />
        <TapeCorner position="br" />

        {/* Zoom icon */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(14,4,7,0.6)',
            border: '1px solid rgba(201,164,99,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e2c27e',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Maximize2 size={13} />
        </div>

        {/* Caption */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '28px 14px 12px',
            background: 'linear-gradient(to top, rgba(14,4,7,0.9) 0%, rgba(14,4,7,0.55) 60%, transparent 100%)',
            textAlign: 'center',
          }}
        >
          {chapter.overlayLines.map((line: string, i: number) => (
            <p
              key={i}
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 18,
                color: `rgba(246,237,216,${0.95 - i * 0.1})`,
                margin: '1px 0',
                lineHeight: 1.25,
                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
              }}
            >
              {line}
            </p>
          ))}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 8.5,
              color: 'rgba(201,164,99,0.7)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            Click to view memory
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LEFT PAGE CONTAINER
// ============================================================
export const LeftPage: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ width, height, children }) => {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: '6px 0 0 6px',
        background: 'linear-gradient(110deg, #d4c1a3 0%, #ece0c8 25%, #f6edd9 60%, #ece0c8 88%, #d8c6a9 100%)',
        boxShadow: 'inset -16px 0 26px rgba(45,25,12,0.35), inset 2px 0 6px rgba(255,255,255,0.2), -4px 6px 16px rgba(0,0,0,0.5)',
        transform: 'rotateY(2deg)',
        transformOrigin: 'right center',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* Paper aging lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent, transparent 19px, rgba(139,115,85,0.07) 19px, rgba(139,115,85,0.07) 20px)',
          pointerEvents: 'none',
        }}
      />
      {/* Double border */}
      <div
        style={{
          position: 'absolute',
          inset: 14,
          border: '2px double rgba(139,100,50,0.4)',
          borderRadius: 3,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 20,
          border: '1px solid rgba(139,100,50,0.18)',
          borderRadius: 2,
          pointerEvents: 'none',
        }}
      />
      {children}
      <SilkRibbon style={{ height: 130 }} />
    </div>
  );
};

// ============================================================
// RIGHT PAGE CONTAINER
// ============================================================
export const RightPage: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ width, height, children }) => {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: '0 6px 6px 0',
        background: 'linear-gradient(70deg, #d8c6a9 0%, #ece0c8 15%, #f6edd9 45%, #ece0c8 85%, #d4c1a3 100%)',
        boxShadow: 'inset 16px 0 26px rgba(45,25,12,0.3), inset -2px 0 6px rgba(255,255,255,0.15), 4px 6px 16px rgba(0,0,0,0.5)',
        transform: 'rotateY(-2deg)',
        transformOrigin: 'left center',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* Paper aging lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent, transparent 19px, rgba(139,115,85,0.07) 19px, rgba(139,115,85,0.07) 20px)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};

// ============================================================
// PAGE TURN (THE 3D TURNING SHEET)
// Rotates around the book binding from 0 deg to -180 deg
// ============================================================
export const PageTurn: React.FC<{
  width: number;
  height: number;
  rotationY: MotionValue<number>;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}> = ({ width, height, rotationY, frontContent, backContent }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width,
        height,
        transformOrigin: 'left center',
        transformStyle: 'preserve-3d',
        rotateY: rotationY,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      {/* Front of Turning Sheet (facing camera from 0 to -90 deg) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: '0 6px 6px 0',
          background: 'linear-gradient(70deg, #d8c6a9 0%, #ece0c8 15%, #f6edd9 45%, #ece0c8 85%, #d4c1a3 100%)',
          boxShadow: 'inset 16px 0 26px rgba(45,25,12,0.3), inset -2px 0 6px rgba(255,255,255,0.15), 6px 12px 28px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 19px, rgba(139,115,85,0.07) 19px, rgba(139,115,85,0.07) 20px)',
          }}
        />
        {frontContent}
      </div>

      {/* Back of Turning Sheet (facing camera from -90 to -180 deg) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '6px 0 0 6px',
          background: 'linear-gradient(110deg, #d4c1a3 0%, #ece0c8 25%, #f6edd9 60%, #ece0c8 88%, #d8c6a9 100%)',
          boxShadow: 'inset -16px 0 26px rgba(45,25,12,0.35), inset 2px 0 6px rgba(255,255,255,0.2), -6px 12px 28px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 19px, rgba(139,115,85,0.07) 19px, rgba(139,115,85,0.07) 20px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 14,
            border: '2px double rgba(139,100,50,0.4)',
            borderRadius: 3,
          }}
        />
        {backContent}
      </div>
    </motion.div>
  );
};

// ============================================================
// INTERACTIVE CHAPTERS BOOK WITH SCROLL PAGE TURNS
// ============================================================
export const InteractiveChaptersBook: React.FC<{
  chapters: ChapterData[];
  onOpenMedia: (mediaUrl: string) => void;
}> = ({ chapters, onOpenMedia }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSpread, setActiveSpread] = useState(0);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 22,
    restDelta: 0.001,
  });

  // Calculate active chapter
  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => {
      const idx = Math.min(Math.floor(v * chapters.length), chapters.length - 1);
      setActiveSpread(Math.max(0, idx));
    });
    return unsub;
  }, [scrollYProgress, chapters.length]);

  // Book dimensions for full stage interactive view
  const pageWidth = 340;
  const pageHeight = 490;
  const spineWidth = 28;

  // Camera zoom: zooms into book during chapter, pulls back slightly during turn
  const bookScale = useTransform(
    smoothProgress,
    [0, 0.08, 0.85, 0.95, 1],
    [0.92, 1.04, 1.04, 0.96, 0.86]
  );

  // Closing cover rotation at the end
  const closingCoverAngle = useTransform(
    smoothProgress,
    [0.92, 0.99],
    [-180, 0]
  );

  // Calculate page turn angle between Chapter activeSpread and activeSpread + 1
  // We compute a dynamic page turn angle for whichever transition is happening
  const totalSteps = chapters.length;
  const turnThresholdStart = (activeSpread + 0.42) / totalSteps;
  const turnThresholdEnd = (activeSpread + 0.92) / totalSteps;

  const currentTurnAngle = useTransform(
    smoothProgress,
    [turnThresholdStart, turnThresholdEnd],
    [0, -180]
  );

  const currentChapter = chapters[activeSpread] || chapters[0];
  const nextChapter = chapters[Math.min(activeSpread + 1, chapters.length - 1)];

  const jumpToChapter = (idx: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const targetScroll = containerTop + (idx / chapters.length) * containerHeight;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      id="story"
      style={{
        position: 'relative',
        height: `${chapters.length * 125}vh`,
        background: 'radial-gradient(ellipse at 50% 40%, #17060b 0%, #0c0306 65%, #060103 100%)',
      }}
    >
      {/* Pinned Stage */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {/* Top chapter pills */}
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            zIndex: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(14,4,7,0.75)',
              padding: '6px 18px',
              borderRadius: 999,
              border: '1px solid rgba(201,164,99,0.25)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => jumpToChapter(idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: idx === activeSpread ? '#e2c27e' : 'rgba(201,164,99,0.4)',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 13,
                  fontWeight: idx === activeSpread ? 700 : 400,
                  transition: 'all 0.3s',
                }}
              >
                <span>{ch.num}</span>
                {idx === activeSpread && (
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {ch.category}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Ambient table shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            width: '85%',
            maxWidth: 820,
            height: 90,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(2,0,1,0.95) 0%, rgba(2,0,1,0.6) 45%, transparent 75%)',
            filter: 'blur(24px)',
            borderRadius: '50%',
            transform: 'rotateX(55deg)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* 3D BOOK SHELL */}
        <BookShell
          scale={bookScale}
          rotateX={14}
          rotateY={-5}
          rotateZ={-1}
          style={{ zIndex: 10 }}
        >
          {/* Hardcover Base */}
          <BookCover
            width={pageWidth}
            height={pageHeight}
            spineWidth={spineWidth}
            frontRotationY={closingCoverAngle}
            isClosed={activeSpread === chapters.length - 1}
          />

          {/* Page Stacks (Thickness) */}
          <PageStack side="left" thickness={22} />
          <PageStack side="right" thickness={22} />

          {/* LEFT PAGE (Current Chapter Editorial) */}
          <LeftPage width={pageWidth} height={pageHeight}>
            <LeftPageContent
              chapter={currentChapter}
              index={activeSpread}
              onLinkClick={() => onOpenMedia(currentChapter.image)}
            />
          </LeftPage>

          {/* CENTRAL SPINE */}
          <div
            style={{
              position: 'relative',
              width: spineWidth,
              height: pageHeight,
              background: 'linear-gradient(to right, #482410 0%, #291206 35%, #180702 50%, #291206 65%, #482410 100%)',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.85), -6px 0 14px rgba(0,0,0,0.8), 6px 0 14px rgba(0,0,0,0.8)',
              zIndex: 15,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 1,
                background: 'rgba(201,164,99,0.35)',
              }}
            />
            <div style={{ width: '80%', height: 3, background: 'linear-gradient(to right, #8a6a2c, #e2c27e, #8a6a2c)', borderRadius: 1 }} />
            <div style={{ width: '80%', height: 3, background: 'linear-gradient(to right, #8a6a2c, #e2c27e, #8a6a2c)', borderRadius: 1 }} />
          </div>

          {/* RIGHT PAGE (Underneath: Next Chapter or Current Chapter Media) */}
          <RightPage width={pageWidth} height={pageHeight}>
            <RightPageContent
              chapter={activeSpread < chapters.length - 1 ? nextChapter : currentChapter}
              onMediaClick={() =>
                onOpenMedia(
                  (activeSpread < chapters.length - 1 ? nextChapter : currentChapter).image
                )
              }
            />
          </RightPage>

          {/* THE PHYSICAL PAGE TURN SHEET (Rotates 0 -> -180 deg around spine) */}
          {activeSpread < chapters.length - 1 && (
            <PageTurn
              width={pageWidth}
              height={pageHeight}
              rotationY={currentTurnAngle}
              frontContent={
                <RightPageContent
                  chapter={currentChapter}
                  onMediaClick={() => onOpenMedia(currentChapter.image)}
                />
              }
              backContent={
                <LeftPageContent
                  chapter={nextChapter}
                  index={activeSpread + 1}
                  onLinkClick={() => onOpenMedia(nextChapter.image)}
                />
              }
            />
          )}
        </BookShell>

        {/* Scroll hint indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            zIndex: 30,
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 9,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(201,164,99,0.5)',
              margin: 0,
            }}
          >
            {activeSpread < chapters.length - 1
              ? 'SCROLL TO TURN NEXT SPREAD'
              : 'SCROLL TO CLOSE MEMORY BOOK'}
          </p>
          <div style={{ display: 'flex', gap: 4 }}>
            <div className="scroll-dot" />
            <div className="scroll-dot" />
          </div>
        </div>
      </div>
    </div>
  );
};

