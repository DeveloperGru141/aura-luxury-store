'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ProductCategory } from '@/types/store';
import { ArrowUpRight } from 'lucide-react';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useLiveCategories } from '@/hooks/useLiveProducts';

interface CategoryGridProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const { products: liveProducts } = useLiveProducts();
  const liveCategories = useLiveCategories();
  const [activeMobileCard, setActiveMobileCard] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const CATEGORY_MOCK_IMAGES: Record<string, string> = {
    bags: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    apparel: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    shoes: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
    watches: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    jewelry: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
  };

  const getCategorySlug = (cat: any) => cat.id || cat.slug || '';

  const findProductForCategory = (cat: any) => {
    const catSlug = getCategorySlug(cat).toLowerCase();
    const catName = cat.name?.toLowerCase() || '';
    return liveProducts.find((p: any) => {
      const pCategory = p.category?.toLowerCase() || '';
      const pCategoryLabel = p.categoryLabel?.toLowerCase() || '';
      const pCategoriesName = p.categories?.name?.toLowerCase() || '';
      return pCategory === catSlug || 
             pCategory === catName ||
             pCategoryLabel === catName ||
             pCategoriesName === catName ||
             pCategoriesName === catSlug;
    });
  };

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
        threshold: 0.15,
      }
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="categories" className="py-8 sm:py-14 lg:py-16 bg-[var(--color-surface)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mb-5 sm:mb-8 lg:mb-10">
          <h2 className="font-sans text-[20px] sm:text-[28px] lg:text-[30px] font-extrabold tracking-tight text-[var(--color-text-primary)] leading-tight uppercase">
            Explore by category
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {liveCategories.map((cat: any, idx: number) => {
            const isMobileHovered = activeMobileCard === cat.id;

            return (
                <div
                  key={cat.id}
                  ref={(el) => {
                    cardRefs.current[cat.id] = el;
                  }}
                  data-cat-id={cat.id}
                  onMouseEnter={() => setActiveMobileCard(cat.id)}
                  onMouseLeave={() => setActiveMobileCard(null)}
                  onTouchStart={() => setActiveMobileCard(cat.id)}
                  onClick={() => {
                    const slugToCat: Record<string, ProductCategory> = {
                      clothes: 'apparel',
                      bags: 'bags',
                      shoes: 'shoes',
                      wristwatches: 'watches',
                      watches: 'watches',
                      jewelry: 'jewelry',
                      apparel: 'apparel',
                    };
                    const mapped = (slugToCat[cat.id] ?? cat.id) as ProductCategory;
                    onSelectCategory(mapped);
                  }}
                  className={`group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 active:scale-[0.98] aspect-[5/3] sm:aspect-[4/3] lg:aspect-[16/10] touch-manipulation min-h-[110px] sm:min-h-[160px] lg:min-h-[180px] border shadow-sm hover:shadow-md ${
                    isMobileHovered
                      ? 'border-[#9A7B1F] shadow-md sm:border-[var(--color-border)] sm:group-hover:border-[#9A7B1F] sm:group-hover:shadow-md'
                      : 'border-[var(--color-border)] hover:border-[#9A7B1F]/60 hover:shadow-md'
                  }`}
                >
                  <Image
                    src={findProductForCategory(cat)?.primaryImage ?? CATEGORY_MOCK_IMAGES[getCategorySlug(cat)] ?? cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className={`mobile-category-img object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
                      isMobileHovered ? 'scale-105 sm:scale-100 sm:group-hover:scale-105' : 'scale-100'
                    }`}
                  />

                  <div
                    className={`absolute inset-0 transition-colors duration-300 ${
                      isMobileHovered
                        ? 'bg-gradient-to-t from-black/80 via-black/30 to-black/5 sm:from-black/80 sm:via-black/30'
                        : 'bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/80'
                    }`}
                  />

                  <div className="absolute top-2.5 right-2.5 z-10">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all flex items-center justify-center group-hover:bg-[#9A7B1F] group-hover:text-white group-hover:border-[#9A7B1F] group-active:scale-90 shadow-sm ${
                        isMobileHovered
                          ? 'bg-[#9A7B1F] text-white border-[#9A7B1F] sm:bg-white sm:text-[var(--color-text-primary)] sm:border-white sm:group-hover:bg-[#9A7B1F] sm:group-hover:text-white'
                          : 'bg-white border-white text-[var(--color-text-primary)]'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <div className="absolute inset-x-3 sm:inset-x-5 bottom-3 sm:bottom-5 z-10">
                    <div className="flex items-center gap-1.5 mb-1">
                      {isMobileHovered && (
                        <span className="relative flex h-1.5 w-1.5 shrink-0 sm:hidden">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9A7B1F] opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#9A7B1F]" />
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 block">
                        {liveProducts.filter((p: any) => p.category === cat.name || p.categories?.name === cat.name).length || cat.count}
                      </span>
                    </div>

                    <h3
                      className={`font-serif text-base sm:text-xl lg:text-xl font-medium transition-colors mb-0.5 sm:mb-1 text-white group-hover:text-white`}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className={`text-xs font-light line-clamp-1 transition-all text-white/80`}
                    >
                      {liveProducts.find((p: any) => p.category === cat.name || p.categories?.name === cat.name)?.tagline ?? cat.tagline}
                    </p>
                  </div>
                </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
