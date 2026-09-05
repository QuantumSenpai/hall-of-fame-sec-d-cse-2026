import React, { useEffect, useRef } from 'react';

interface HeroInteractiveDotGridProps {
  className?: string;
}

export const HeroInteractiveDotGrid: React.FC<HeroInteractiveDotGridProps> = ({
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isVisible = document.visibilityState === 'visible';
    let isTouch = false;

    // Detect touch / no-hover devices
    if (typeof window !== 'undefined') {
      isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
    }

    let width = 0;
    let height = 0;
    const spacing = 32; // Grid cell spacing in px

    // Mouse state
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
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

      // Re-evaluate touch status on resize
      isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;

      if (isTouch) {
        // Draw static grid once on mobile to conserve 100% battery & CPU
        drawMobileStaticGrid();
      }
    };

    const drawMobileStaticGrid = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(201, 160, 92, 0.08)'; // Pure flat opacity, no glow
      const radius = 1.1;

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isTouch) return;
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible && !isTouch && animationFrameId === null) {
        render();
      } else if (!isVisible && animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // Render loop for desktop mouse-reactive interaction
    const render = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      if (isTouch) {
        // Mobile stays static
        drawMobileStaticGrid();
        animationFrameId = null;
        return;
      }

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const maxDist = 130; // Interactive radius
      const maxDistSq = maxDist * maxDist;

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distSq = dx * dx + dy * dy;

          let posX = x;
          let posY = y;
          let radius = 1.15;
          let alpha = 0.07;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / maxDist;
            const easeFactor = factor * factor;

            // Subtle push away from cursor
            const push = easeFactor * 7;
            posX += (dx / (dist || 1)) * push;
            posY += (dy / (dist || 1)) * push;

            // Scale and brighten cleanly without glow filters
            radius = 1.15 + easeFactor * 1.8;
            alpha = 0.07 + easeFactor * 0.38;
          }

          ctx.beginPath();
          ctx.arc(posX, posY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 160, 92, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);

    handleResize();
    if (!isTouch) {
      render();
    } else {
      drawMobileStaticGrid();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
