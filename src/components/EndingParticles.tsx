import React, { useEffect, useRef } from 'react';

export interface EndingParticlesProps {
  mode?: 'spark' | 'ambient';
  count?: number;
  active?: boolean;
}

export const EndingParticles: React.FC<EndingParticlesProps> = ({
  mode = 'spark',
  count = 70,
  active = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isSpark = mode === 'spark';
    const particleCount = count || 70;

    // Create golden electric spark & energy particles
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: isSpark ? Math.random() * 2.8 + 0.8 : Math.random() * 2.5 + 0.5,
      speedX: isSpark ? (Math.random() - 0.5) * 1.2 : (Math.random() - 0.5) * 0.4,
      speedY: isSpark ? -Math.random() * 1.6 - 0.4 : -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      color: isSpark
        ? Math.random() > 0.6
          ? '#FFE680'
          : Math.random() > 0.3
            ? '#C9A463'
            : '#FFAE42'
        : Math.random() > 0.4
          ? '#B9905A'
          : '#B95F46',
      twinkleSpeed: Math.random() * 0.05 + 0.02,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (!active) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Subtle spark twinkle
        p.opacity += Math.sin(Date.now() * p.twinkleSpeed) * 0.02;
        p.opacity = Math.max(0.15, Math.min(1, p.opacity));

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = isSpark ? 14 : 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, count, active]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-30 transition-opacity duration-700 ${
        active ? 'opacity-85' : 'opacity-0'
      }`}
    />
  );
};
