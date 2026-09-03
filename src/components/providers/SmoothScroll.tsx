'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respect reduced motion — no smooth scroll
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Mobile: use native scroll for perf — only smooth on desktop + fine pointer
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isMobileWidth = window.innerWidth < 768;
    const useSmooth = !isCoarse && !isMobileWidth;

    // Even on mobile we can init Lenis but with smoothTouch false to avoid lag
    const lenis = new Lenis({
      autoRaf: true,
      lerp: useSmooth ? 0.075 : 0.12,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.2,
      gestureOrientation: 'vertical',
    });

    // Efficient RAF — Lenis autoRaf true handles it, but ensure we clean up
    const handleAnchor = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -80, duration: 1.1 });
      }
    };
    document.addEventListener('click', handleAnchor);

    return () => {
      document.removeEventListener('click', handleAnchor);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
