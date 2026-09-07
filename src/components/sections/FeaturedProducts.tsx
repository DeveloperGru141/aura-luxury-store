'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCategory } from '@/types/store';
import ProductCard from '@/components/ui/ProductCard';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import ScrollReveal from '@/components/ScrollReveal';

interface FeaturedProductsProps {
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
}

export default function FeaturedProducts({
  activeCategory,
  setActiveCategory,
}: FeaturedProductsProps) {
  const { products: liveProducts, loading } = useLiveProducts();

  const tabs: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Collections' },
    { id: 'bags', label: 'Bags' },
    { id: 'apparel', label: 'Wears' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'watches', label: 'Wristwatches' },
    { id: 'jewelry', label: 'Fine Jewelry' },
  ];

  const filteredProducts = liveProducts.filter((product) => {
    const matchesCat = activeCategory === 'all' || product.category === activeCategory;
    return matchesCat;
  });

  return (
    <section id="catalogue" className="py-8 sm:py-14 lg:py-16 bg-[var(--color-surface-alt)] border-y border-[var(--color-border)] relative" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
          <h2 className="font-serif text-[22px] sm:text-3xl lg:text-[32px] font-light text-[var(--color-text-primary)] leading-tight">
            The catalogue
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[var(--color-border)] overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0 snap-x snap-mandatory scrollbar-none overscroll-x-contain touch-manipulation">
              {tabs.map((tab) => {
                const isActive = activeCategory === tab.id;
                const count =
                  tab.id === 'all'
                    ? liveProducts.length
                    : liveProducts.filter((p) => p.category === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const idx = tabs.findIndex((t) => t.id === tab.id);
                        const dir = e.key === 'ArrowRight' ? 1 : -1;
                        const next = tabs[(idx + dir + tabs.length) % tabs.length];
                        setActiveCategory(next.id);
                      }
                    }}
                    className={`snap-start px-4 py-2.5 min-h-[40px] rounded-full text-[11px] sm:text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-gold)] focus-visible:ring-offset-2 ${
                      isActive
                        ? 'bg-black text-white font-semibold shadow-sm'
                        : 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] active:scale-[0.97]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-black/15 text-black font-bold' : 'bg-[var(--color-surface-alt)] text-[var(--color-text-tertiary)] border border-[var(--color-border)]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="catalogue-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white">
                  <div className="aspect-[1/1] w-full skeleton-shimmer" />
                  <div className="p-2.5 space-y-2">
                    <div className="h-3 w-2/3 rounded skeleton-shimmer" />
                    <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                    <div className="h-6 w-full rounded-lg skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              key="catalogue-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="py-10 sm:py-16 text-center border border-[var(--color-border)] rounded-2xl bg-white px-6"
            >
              <p className="font-serif text-base font-light text-[var(--color-text-primary)]">Next small-run drop releasing soon</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-2 mb-4">This category is in production at the Ilorin atelier. Message for lot photos and early access.</p>
              <a href="https://wa.me/2347065076565?text=Hi%20Omo%20Esho%20Signatures,%20please%20add%20me%20to%20the%20waitlist." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-black hover:bg-zinc-900 text-white px-5 py-2.5 text-xs font-semibold hover:shadow-md active:scale-[0.97] transition-all">Chat with Concierge to Reserve</a>
            </motion.div>
          ) : (
            <motion.div
              key={`catalogue-grid-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4"
            >
              {filteredProducts.map((product, idx) => {
                // Stagger 60ms between cards in each row on mobile (2 cols)
                const stagger = (idx % 2) * 0.06;
                return (
                  <ScrollReveal key={product.id} delay={stagger} className="h-full">
                    <ProductCard product={product} />
                  </ScrollReveal>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
