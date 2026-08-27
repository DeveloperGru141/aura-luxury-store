'use client';

import React from 'react';
import Image from 'next/image';
import { CATEGORIES } from '@/data/mockData';
import { ProductCategory } from '@/types/store';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  return (
    <section id="categories" className="py-20 bg-[#0D0F14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white">
              Explore By <span className="italic font-normal gold-gradient-text">Category</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mt-4 md:mt-0 leading-relaxed">
            From handcrafted Italian leather bags to Swiss automatic timepieces, discover statement pieces designed to endure generations.
          </p>
        </div>

        {/* 5-Category Bento Grid (Order: Bags, Wears, Shoes, Wristwatches, Jewelry) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const isFeatured = idx === 0 || idx === 3;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as ProductCategory)}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-700 aspect-[4/3] sm:aspect-[16/10] ${
                  isFeatured ? 'md:col-span-1 lg:col-span-1' : ''
                }`}
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-1000 ease-out"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:via-black/40 transition-colors" />

                {/* Card Top Pill */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Info Bottom */}
                <div className="absolute inset-x-6 bottom-6 z-10">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-1 block">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-white mb-1 group-hover:text-[#F3E5AB] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-300 font-light opacity-90 line-clamp-1">
                    {cat.tagline}
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
