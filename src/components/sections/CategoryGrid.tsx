'use client';

import React from 'react';
import Image from 'next/image';
import { CATEGORIES } from '@/data/mockData';
import { ProductCategory } from '@/types/store';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface CategoryGridProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
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

        {/* 5-Category Bento Grid — fluid gaps + responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, idx) => {
            const isFeatured = idx === 0 || idx === 3;
            return (
              <ScrollReveal key={cat.id} delay={idx * 0.07} className="h-full">
                <div
                  onClick={() => onSelectCategory(cat.id as ProductCategory)}
                  className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#D4AF37]/40 active:border-[#D4AF37]/60 transition-all duration-700 aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] touch-manipulation min-h-[180px] ${
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
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
