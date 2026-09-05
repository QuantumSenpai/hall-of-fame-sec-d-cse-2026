import React, { useEffect, useRef } from 'react';

interface HeroAmbientParticlesProps {
  className?: string;
  particleCount?: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const HeroAmbientParticles: React.FC<HeroAmbientParticlesProps> = ({
  className = '',
  particleCount = 20, // Low density (15-25 particles max)
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isVisible = document.visibilityState === 'visible';
    let width = 0;
    let height = 0;

    const particles: Particle[] = [];

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const baseAlpha = 0.12 + Math.random() * 0.18; // Low opacity, pure flat
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.0 + Math.random() * 1.5, // 1.0px to 2.5px
          vx: (Math.random() - 0.5) * 0.18, // Very slow horizontal drift
          vy: -0.15 - Math.random() * 0.25, // Gentle upward rise
          alpha: baseAlpha,
          baseAlpha,
          pulseSpeed: 0.015 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles();
    };

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible && animationFrameId === null) {
        render();
      } else if (!isVisible && animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const render = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Pulse alpha gently
        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.08;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 106, ${Math.max(0.04, p.alpha).toFixed(3)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    handleResize();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
