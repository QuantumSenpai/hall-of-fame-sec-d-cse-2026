import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger once at app entry
gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/**
 * Initializes Lenis smooth scrolling and binds it directly with GSAP's ticker & ScrollTrigger.
 */
export function initSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (lenisInstance) return lenisInstance;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReduced = reducedMotionQuery.matches;

  const lenis = new Lenis({
    duration: prefersReduced ? 0.01 : 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !prefersReduced,
    syncTouch: false,
  });

  lenisInstance = lenis;

  // Bind Lenis scroll events to ScrollTrigger updates
  lenis.on('scroll', ScrollTrigger.update);

  // Connect Lenis to GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Handle prefers-reduced-motion dynamically
  const handleReducedMotion = (matches: boolean) => {
    if (matches) {
      gsap.globalTimeline.timeScale(100);
    } else {
      gsap.globalTimeline.timeScale(1);
    }
  };
  handleReducedMotion(prefersReduced);

  reducedMotionQuery.addEventListener('change', (e) => {
    handleReducedMotion(e.matches);
  });

  // ScrollTrigger refresh on fonts ready & window resize
  if (document.fonts) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

// Debounced helper for images or dynamic layout updates
let refreshTimeout: number | undefined;
export function debouncedScrollTriggerRefresh(delay = 120) {
  if (typeof window === 'undefined') return;
  if (refreshTimeout) window.clearTimeout(refreshTimeout);
  refreshTimeout = window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, delay);
}
