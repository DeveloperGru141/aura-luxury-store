'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Delay in seconds — e.g. 0.06, 0.12 — keeps stagger subtle for luxury feel */
  delay?: number;
  /** Intersection threshold — 0.08 triggers reliably without delay on mobile */
  threshold?: number;
  /** Root margin — slight negative bottom triggers as element enters viewport */
  rootMargin?: string;
  className?: string;
  /** Tag to render as — defaults to div */
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * OMO ESHO SIGNATURES ScrollReveal
 * - Hardware-accelerated entrance: opacity 0 → 1, translateY 16px → 0
 * - IntersectionObserver: fires ONCE, immediately unobserves and disconnects
 * - Duration: 500ms ease-out (cubic-bezier(0.16, 1, 0.3, 1))
 * - Reduced motion: skips animation entirely if prefers-reduced-motion is active
 */
export default function ScrollReveal({
  children,
  delay = 0,
  threshold = 0.08,
  rootMargin = '0px 0px -25px 0px',
  className = '',
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Honor user accessibility preference immediately
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      setIsVisible(true);
      return;
    }

    const listener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setPrefersReducedMotion(true);
        setIsVisible(true);
      }
    };
    mediaQuery.addEventListener('change', listener);

    const el = ref.current;
    if (!el) {
      mediaQuery.removeEventListener('change', listener);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate ONCE — disconnect observer immediately to avoid any background overhead
          observer.unobserve(entry.target);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      mediaQuery.removeEventListener('change', listener);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const Component = Tag as React.ElementType;

  if (prefersReducedMotion) {
    return (
      <Component ref={ref as React.RefObject<HTMLElement>} className={className} data-scroll-reveal>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={ref as React.RefObject<HTMLElement>}
      data-scroll-reveal
      className={`${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} will-change-transform`}
      style={{
        transitionProperty: 'transform, opacity',
        transitionDuration: '0.5s',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}s`,
        willChange: isVisible ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </Component>
  );
}

