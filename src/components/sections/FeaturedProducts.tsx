'use client';

import React, { useState } from 'react';
import { ProductCategory, Product } from '@/types/store';
import { PRODUCTS } from '@/data/mockData';
import ProductCard from '@/components/ui/ProductCard';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

interface FeaturedProductsProps {
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
}

export default function FeaturedProducts({
  activeCategory,
  setActiveCategory,
}: FeaturedProductsProps) {
  const [filterTrendingOnly, setFilterTrendingOnly] = useState(false);

  const tabs: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Collections' },
    { id: 'bags', label: 'Bags & Leather' },
    { id: 'apparel', label: 'Haute Couture' },
    { id: 'shoes', label: 'Footwear' },
    { id: 'watches', label: 'Timepieces' },
    { id: 'jewelry', label: 'Fine Jewelry' },
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCat = activeCategory === 'all' || product.category === activeCategory;
    const matchesTrending = filterTrendingOnly ? product.isTrending : true;
    return matchesCat && matchesTrending;
  });

  return (
    <section id="catalogue" className="py-20 bg-[#0E1117] border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Seasonal Showcase</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white mb-4">
            The Autumn <span className="italic font-normal gold-gradient-text">Catalogue</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light">
            Indulge in certified haute couture garments, Italian leather craftsmanship, chronographs, and diamond fine jewelry.
          </p>
        </div>

        {/* Filter Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-white/10 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {tabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              const count =
                tab.id === 'all'
                  ? PRODUCTS.length
                  : PRODUCTS.filter((p) => p.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-bold shadow-lg shadow-[#D4AF37]/10'
                      : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
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

          {/* Quick Trending Filter Toggle */}
          <button
            onClick={() => setFilterTrendingOnly(!filterTrendingOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 shrink-0 border ${
              filterTrendingOnly
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB]'
                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Trending Only</span>
          </button>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-sm font-medium">No items found matching the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
