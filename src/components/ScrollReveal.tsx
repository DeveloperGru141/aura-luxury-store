'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Delay in seconds — e.g. 0.05, 0.1 — keeps stagger subtle for luxury feel */
  delay?: number;
  /** Intersection threshold — 0.15 feels premium without feeling late */
  threshold?: number;
  /** Root margin — negative bottom triggers slightly before element hits viewport */
  rootMargin?: string;
  className?: string;
  /** Tag to render as — defaults to div, keeps layout styling flexible */
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * TIMELESS ScrollReveal — ultra-premium, performant, once-only reveal
 * - IntersectionObserver (no scroll listeners) → 60fps on mobile GPUs
 * - Animates ONCE: observer.unobserve() on intersect → no reverse on scroll up
 * - Minimal lift: translate-y-6 (24px) + opacity-0 → opacity-100
 * - Luxury deceleration: cubic-bezier(0.16, 1, 0.3, 1) — snappy yet decelerated
 * - will-change: transform, opacity for hardware acceleration
 */
export default function ScrollReveal({
  children,
  delay = 0,
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  className = '',
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate ONCE — do not loop backward on scroll up
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref as React.RefObject<HTMLElement>}
      className={`${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} will-change-transform`}
      style={{
        // Luxury cubic-bezier + will-change for GPU layer promotion (24px max lift)
        transitionProperty: 'transform, opacity',
        transitionDuration: '0.8s',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}s`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </Component>
  );
}
