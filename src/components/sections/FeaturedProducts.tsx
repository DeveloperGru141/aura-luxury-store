'use client';

import React from 'react';
import { ProductCategory } from '@/types/store';
import ProductCard from '@/components/ui/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import { Sparkles } from 'lucide-react';
import { useLiveProducts } from '@/hooks/useLiveProducts';

interface FeaturedProductsProps {
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
}

export default function FeaturedProducts({
  activeCategory,
  setActiveCategory,
}: FeaturedProductsProps) {
  const { products: liveProducts } = useLiveProducts();

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
        {/* Section Title — fluid */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3E5AB] text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>Curated Showcase</span>
          </div>
          <h2 className="font-serif text-[28px] sm:text-4xl lg:text-5xl font-light text-white mb-3 sm:mb-4 leading-tight">
            The <span className="italic font-normal gold-gradient-text">Catalogue</span>
          </h2>
          <p className="text-[13px] sm:text-sm text-gray-400 font-light leading-relaxed">
            Explore our curated inventory of leather bags, fine wears, shoes, luxury chronographs, and certified jewelry.
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
                  className={`snap-start px-3.5 sm:px-4 py-2.5 min-h-[40px] rounded-xl text-[11px] sm:text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 sm:gap-2 shrink-0 touch-manipulation ${
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

        {/* Product Grid — fluid gaps */}
        {filteredProducts.length === 0 ? (
          <div className="py-12 sm:py-20 text-center text-gray-400">
            <p className="text-sm font-medium">No items found matching the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={(index % 4) * 0.05} className="h-full">
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
