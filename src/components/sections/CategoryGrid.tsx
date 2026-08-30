'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ProductCategory } from '@/types/store';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { useLiveCategories } from '@/hooks/useLiveProducts';

interface CategoryGridProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const liveCategories = useLiveCategories();
  const [activeMobileCard, setActiveMobileCard] = useState<string | null>(liveCategories[0]?.id || null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (liveCategories[0]?.id) setActiveMobileCard(liveCategories[0].id);
  }, [liveCategories]);

  useEffect(() => {
    // Only engage scroll-driven active hover on mobile & touch viewports
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute('data-cat-id');
            if (cardId) {
              setActiveMobileCard(cardId);
            }
          }
        });
      },
      {
        // Focus on mobile viewport center band with flexible threshold
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.15,
      }
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="categories" className="py-12 sm:py-16 lg:py-20 bg-[#0D0F14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — fluid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37] block mb-1.5 sm:mb-2">
              Curated Collections
            </span>
            <h2 className="font-serif text-[26px] sm:text-3xl lg:text-4xl font-light text-white leading-tight">
              Explore By <span className="italic font-normal gold-gradient-text">Category</span>
            </h2>
          </div>
          <p className="text-[13px] sm:text-sm text-gray-400 max-w-md leading-relaxed">
            From handcrafted Italian leather bags to Swiss automatic timepieces, discover statement pieces designed to endure generations.
          </p>
        </div>

        {/* 5-Category Bento Grid — fluid gaps + scroll-driven mobile hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {liveCategories.map((cat: any, idx: number) => {
            const isFeatured = idx === 0 || idx === 3;
            const isMobileHovered = activeMobileCard === cat.id;

            return (
              <ScrollReveal key={cat.id} delay={idx * 0.07} className="h-full">
                <div
                  ref={(el) => {
                    cardRefs.current[cat.id] = el;
                  }}
                  data-cat-id={cat.id}
                  onTouchStart={() => setActiveMobileCard(cat.id)}
                  onClick={() => onSelectCategory(cat.id as ProductCategory)}
                  className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] touch-manipulation min-h-[180px] ${
                    isFeatured ? 'md:col-span-1 lg:col-span-1' : ''
                  } ${
                    isMobileHovered
                      ? 'border border-[#D4AF37]/75 shadow-2xl shadow-[#D4AF37]/15 ring-1 ring-[#D4AF37]/30 sm:ring-0 sm:shadow-none sm:border-white/10 sm:hover:border-[#D4AF37]/40'
                      : 'border border-white/10 hover:border-[#D4AF37]/40 active:border-[#D4AF37]/60'
                  }`}
                >
                  {/* Background Image — zooms when scrolled into focus on mobile, and on desktop hover */}
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={`mobile-category-img object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108 ${
                      isMobileHovered ? 'scale-105 sm:scale-100 sm:group-hover:scale-108' : 'scale-100'
                    }`}
                  />

                  {/* Dark Vignette Overlay */}
                  <div
                    className={`absolute inset-0 transition-colors duration-500 ${
                      isMobileHovered
                        ? 'bg-gradient-to-t from-black/95 via-black/35 to-black/10 sm:from-black/90 sm:via-black/30'
                        : 'bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:via-black/40'
                    }`}
                  />

                  {/* Card Top Action Pill */}
                  <div className="absolute top-4 right-4 z-10">
                    <div
                      className={`w-9 h-9 rounded-full backdrop-blur-md border transition-all flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black group-active:scale-90 ${
                        isMobileHovered
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] scale-105 shadow-lg shadow-[#D4AF37]/30 sm:bg-black/50 sm:text-white sm:border-white/10 sm:scale-100 sm:group-hover:bg-[#D4AF37] sm:group-hover:text-black'
                          : 'bg-black/50 border-white/10 text-white'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Card Info Bottom */}
                  <div className="absolute inset-x-6 bottom-6 z-10">
                    <div className="flex items-center gap-1.5 mb-1">
                      {isMobileHovered && (
                        <span className="relative flex h-1.5 w-1.5 shrink-0 sm:hidden">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]" />
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block">
                        {cat.count}
                      </span>
                    </div>

                    <h3
                      className={`font-serif text-2xl font-medium transition-colors mb-1 ${
                        isMobileHovered
                          ? 'text-[#F3E5AB] sm:text-white sm:group-hover:text-[#F3E5AB]'
                          : 'text-white group-hover:text-[#F3E5AB]'
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className={`text-xs font-light line-clamp-1 transition-all ${
                        isMobileHovered
                          ? 'text-gray-200 opacity-100 sm:text-gray-300 sm:opacity-90'
                          : 'text-gray-300 opacity-90'
                      }`}
                    >
                      {cat.tagline}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
