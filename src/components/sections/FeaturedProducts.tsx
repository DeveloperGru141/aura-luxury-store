'use client';

import React from 'react';
import { ProductCategory } from '@/types/store';
import ProductCard from '@/components/ui/ProductCard';
import { useLiveProducts } from '@/hooks/useLiveProducts';

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
    <section id="catalogue" className="py-10 sm:py-14 lg:py-16 bg-[var(--color-surface-alt)] border-y border-[var(--color-border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
          <h2 className="font-serif text-[26px] sm:text-3xl lg:text-[32px] font-light text-[var(--color-text-primary)] mb-3 leading-tight">
            The catalogue
          </h2>
          <p className="text-[13px] sm:text-sm text-[var(--color-text-tertiary)] font-light leading-relaxed">
            Filter by house — every piece lists its atelier, material and price in naira, with live stock from Supabase.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-[var(--color-border)] overflow-hidden">
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
                      ? 'bg-[var(--color-accent-gold)] text-black font-semibold shadow-sm'
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

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white">
                <div className="aspect-[3/4] w-full skeleton-shimmer" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-2/3 rounded skeleton-shimmer" />
                  <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                  <div className="h-6 w-full rounded-lg skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 sm:py-16 text-center border border-[var(--color-border)] rounded-2xl bg-white px-6">
            <p className="font-serif text-base font-light text-[var(--color-text-primary)]">Next small-run drop releasing soon</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-2 mb-4">This category is in production at the Ilorin atelier. Message for lot photos and early access.</p>
            <a href="https://wa.me/2347065076565?text=Hi%20Omo%20Esho%20Signatures,%20please%20add%20me%20to%20the%20waitlist." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] text-black px-5 py-2.5 text-xs font-semibold hover:shadow-md active:scale-[0.97] transition-all">Chat with Concierge to Reserve</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
