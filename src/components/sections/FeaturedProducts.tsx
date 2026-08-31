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

  // Exact order: Bags, Wears (Clothes), Shoes, Wristwatches, Jewelry
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
    <section id="catalogue" className="py-12 sm:py-16 lg:py-20 bg-[#0E1117] border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title — concrete, no decorative eyebrow */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
          <h2 className="font-serif text-[28px] sm:text-4xl lg:text-5xl font-light text-white mb-3 sm:mb-4 leading-tight">
            The <span className="italic font-normal gold-gradient-text">catalogue</span>
          </h2>
          <p className="text-[13px] sm:text-sm text-gray-400 font-light leading-relaxed">
            Filter by house — every piece lists its atelier, material and price in naira, with live stock from Supabase.
          </p>
        </div>

        {/* Filter Tabs Bar — fluid, scroll snap on mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 pb-3 sm:pb-4 border-b border-white/10 overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0 snap-x snap-mandatory scrollbar-none overscroll-x-contain touch-manipulation">
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
                  className={`snap-start px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl text-[11px] sm:text-xs font-medium uppercase tracking-wider transition-[transform,background-color] duration-150 whitespace-nowrap flex items-center gap-1.5 sm:gap-2 shrink-0 touch-manipulation active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-bold shadow-lg shadow-[#D4AF37]/10'
                      : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/15'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-black/20 text-black font-extrabold' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid — asymmetrical editorial, warm skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8DDD0] bg-white ${i===0 ? 'lg:col-span-7 lg:row-span-2' : i===1 ? 'lg:col-span-5' : 'lg:col-span-4'}`}>
                <div className="aspect-[3/4] w-full skeleton-shimmer bg-[#FDFBF7]" />
                <div className="p-2.5 sm:p-3 space-y-2">
                  <div className="h-3 w-2/3 rounded skeleton-shimmer" />
                  <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                  <div className="h-8 w-full rounded-lg skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 sm:py-16 text-center border border-[#E8DDD0] rounded-2xl bg-[#FDFBF7] px-6">
            <p className="font-serif text-base font-light text-[#121212]">Next small-run drop releasing soon</p>
            <p className="text-xs text-[#5A5248] mt-2 mb-4">This category is in production in Florence/Como. Join the waitlist and our Ilorin concierge will message you lot photos first.</p>
            <a href="https://wa.me/2347065076565?text=Hi%20Omo%20Esho%20Signatures,%20please%20add%20me%20to%20the%20waitlist." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#121212] text-white px-4 py-2 text-xs font-medium">Join concierge waitlist</a>
          </div>
        ) : (
          <>
            {/* Mobile: snap carousel with peek */}
            <div className="flex lg:hidden gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 pb-1 overscroll-x-contain">
              {filteredProducts.map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[84vw] max-w-[280px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {/* Desktop: asymmetrical grid */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 auto-rows-fr">
              {filteredProducts.map((product, idx) => (
                <div key={product.id} className={`${idx===0 ? 'lg:col-span-7 lg:row-span-2' : idx===1 ? 'lg:col-span-5' : 'lg:col-span-3'}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
