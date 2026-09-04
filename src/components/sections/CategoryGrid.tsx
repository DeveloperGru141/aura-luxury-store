'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ProductCategory } from '@/types/store';
import { ArrowUpRight } from 'lucide-react';
import { useLiveProducts, useLiveCategories } from '@/hooks/useLiveProducts';

interface CategoryGridProps {
  onSelectCategory: (category: ProductCategory) => void;
}

interface CuratedCategoryConfig {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  categoryKey: ProductCategory;
  fallbackImage: string;
  aliases: string[];
}

const CURATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    id: 'shoes',
    name: 'Shoes',
    slug: 'shoes',
    tagline: 'Sculpted Stiletto Heels & Blake-Stitched Loafers',
    categoryKey: 'shoes',
    fallbackImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
    aliases: ['shoes', 'footwear', 'loafers', 'heels'],
  },
  {
    id: 'watches',
    name: 'Timepieces',
    slug: 'watches',
    tagline: 'Automatic Calibres & Master Chronometers',
    categoryKey: 'watches',
    fallbackImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    aliases: ['watches', 'wristwatches', 'timepieces', 'watch'],
  },
  {
    id: 'bags',
    name: 'Designer Bags',
    slug: 'bags',
    tagline: 'Hand-stitched Full-Grain Ilorin Leathers & Satchels',
    categoryKey: 'bags',
    fallbackImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    aliases: ['bags', 'handbags', 'leather-bags', 'satchels'],
  },
  {
    id: 'apparel',
    name: 'Wears',
    slug: 'apparel',
    tagline: 'Silk Gowns, Virgin Wool Tailoring & Knitwear',
    categoryKey: 'apparel',
    fallbackImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    aliases: ['apparel', 'clothes', 'wears', 'clothing'],
  },
];

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const { products: liveProducts } = useLiveProducts();
  const liveCategories = useLiveCategories();
  const shouldReduceMotion = useReducedMotion();
  const [activeMobileCard, setActiveMobileCard] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
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
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.2,
      }
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Compute display data for the 4 core categories
  const categoryCards = useMemo(() => {
    return CURATED_CATEGORIES.map((cfg) => {
      // Find matching live category if present
      const matchedLiveCat = liveCategories.find((c: any) => {
        const cSlug = (c.id || c.slug || '').toLowerCase();
        const cName = (c.name || '').toLowerCase();
        return cfg.aliases.some((a) => cSlug.includes(a) || cName.includes(a));
      });

      // Find products belonging to this category
      const matchingProducts = liveProducts.filter((p: any) => {
        const pCat = (p.category || '').toLowerCase();
        const pLabel = (p.categoryLabel || '').toLowerCase();
        const pCatName = (p.categories?.name || '').toLowerCase();
        const pCatSlug = (p.categories?.slug || '').toLowerCase();

        return cfg.aliases.some(
          (a) =>
            pCat === a ||
            pLabel.includes(a) ||
            pCatName.includes(a) ||
            pCatSlug.includes(a)
        );
      });

      // Find best representative product photo
      const sampleProduct = matchingProducts.find((p) => p.primaryImage);
      const displayImage =
        sampleProduct?.primaryImage ||
        matchedLiveCat?.image ||
        cfg.fallbackImage;

      const count = matchingProducts.length;

      return {
        ...cfg,
        image: displayImage,
        productCount: count > 0 ? `${count} Pieces` : 'Curated',
      };
    });
  }, [liveProducts, liveCategories]);

  return (
    <section
      id="categories"
      className="py-10 sm:py-14 lg:py-16 bg-[var(--color-surface)] relative"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-5 sm:mb-8"
        >
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C43] mb-1">
              Curated Departments
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-[var(--color-text-primary)] leading-tight uppercase">
              Explore by Category
            </h2>
          </div>
        </motion.div>

        {/* 4-Card Luxury Grid: 2x2 on mobile, 4 across on desktop (Uncrammed, generous aspect ratio) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {categoryCards.map((cat, idx) => {
            const isMobileHovered = activeMobileCard === cat.id;

            return (
              <motion.div
                key={cat.id}
                ref={(el) => {
                  cardRefs.current[cat.id] = el;
                }}
                data-cat-id={cat.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: shouldReduceMotion ? 0.2 : 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                }}
                onMouseEnter={() => setActiveMobileCard(cat.id)}
                onMouseLeave={() => setActiveMobileCard(null)}
                onTouchStart={() => setActiveMobileCard(cat.id)}
                onClick={() => onSelectCategory(cat.categoryKey)}
                className={`group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.98] aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] min-h-[170px] sm:min-h-[220px] border shadow-sm hover:shadow-lg touch-manipulation will-change-transform ${
                  isMobileHovered
                    ? 'border-[#9A7B1F] shadow-md sm:border-[var(--color-border)] sm:group-hover:border-[#9A7B1F]'
                    : 'border-[var(--color-border)] hover:border-[#9A7B1F]/60'
                }`}
              >
                {/* Background Category Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
                    isMobileHovered ? 'scale-105 sm:scale-100 sm:group-hover:scale-105' : 'scale-100'
                  }`}
                />

                {/* Scrim Gradient Overlay for Text Readability */}
                <div
                  className={`absolute inset-0 transition-colors duration-300 ${
                    isMobileHovered
                      ? 'bg-gradient-to-t from-black/85 via-black/35 to-black/10 sm:from-black/80 sm:via-black/25'
                      : 'bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/85'
                  }`}
                />

                {/* Top-Right Minimal Arrow Badge */}
                <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border transition-all flex items-center justify-center group-hover:bg-[#9A7B1F] group-hover:text-white group-hover:border-[#9A7B1F] group-active:scale-90 shadow-sm ${
                      isMobileHovered
                        ? 'bg-[#9A7B1F] text-white border-[#9A7B1F] sm:bg-white sm:text-[var(--color-text-primary)] sm:border-white sm:group-hover:bg-[#9A7B1F] sm:group-hover:text-white'
                        : 'bg-white/90 backdrop-blur-sm border-white/90 text-[var(--color-text-primary)]'
                    }`}
                  >
                    <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Bottom Content: Clean & Uncrammed */}
                <div className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 z-10">
                  {/* Item Count */}
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#E6C875] block mb-0.5 sm:mb-1">
                    {cat.productCount}
                  </span>

                  {/* Category Title */}
                  <h3 className="font-serif text-[15px] sm:text-xl lg:text-xl font-medium text-white group-hover:text-white leading-tight">
                    {cat.name}
                  </h3>

                  {/* Tagline: Shown on desktop/tablet, hidden on small mobile to avoid cramming */}
                  <p className="hidden sm:block text-[11px] sm:text-xs font-light text-white/80 line-clamp-1 mt-1">
                    {cat.tagline}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
