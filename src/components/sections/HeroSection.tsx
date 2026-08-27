'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Award, Flame } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/data/mockData';

export default function HeroSection() {
  const { setQuickViewProduct } = useStore();

  const heroHeroProduct = PRODUCTS.find((p) => p.id === 'bag-01') || PRODUCTS[0];

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-24 bg-gradient-to-b from-[#0D0F14] via-[#10131A] to-[#0D0F14]">
      {/* Subtle background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F3E5AB] text-xs font-medium mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="tracking-wide">Autumn-Winter Haute Couture &amp; Fine Horology</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-light text-white tracking-tight leading-[1.1] mb-6">
              Elegance <span className="italic font-normal gold-gradient-text">Redefined</span>.
              <br />
              Crafted Without <br className="hidden sm:inline" />
              Compromise.
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-gray-300 max-w-xl font-light leading-relaxed mb-8">
              Explore an extraordinary curation of hand-stitched Italian leather bags, bespoke tailoring, Swiss automatic timepieces, sculpted footwear, and certified 18k fine jewelry.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="#categories"
                className="py-3.5 px-7 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-[#D4AF37]/10"
              >
                <span>Explore Curations</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#lookbook"
                className="py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2"
              >
                <span>View Lookbook</span>
              </a>
            </div>

            {/* Trust Proof Badges */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 w-full max-w-lg text-left">
              <div>
                <div className="flex items-center gap-1.5 text-white font-serif text-xl sm:text-2xl font-bold">
                  <span>50k+</span>
                </div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">
                  Clients Worldwide
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-white font-serif text-xl sm:text-2xl font-bold">
                  <span>100%</span>
                </div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">
                  Certified Authentic
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-serif text-xl sm:text-2xl font-bold">
                  <span>4.9★</span>
                </div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">
                  Maison Rating
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Masterpiece */}
          <div className="lg:col-span-5 relative">
            {/* Main Editorial Image */}
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#161922] group">
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
                alt="Haute Couture Autumn Editorial"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Floating Featured Product Pill */}
              <div
                onClick={() => setQuickViewProduct(heroHeroProduct)}
                className="absolute bottom-6 inset-x-6 p-4 rounded-2xl glass-panel text-white cursor-pointer hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group/card shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                    <Image
                      src={heroHeroProduct.primaryImage}
                      alt={heroHeroProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#D4AF37]">
                      Featured Runway Piece
                    </span>
                    <h3 className="text-xs font-serif font-medium text-white line-clamp-1">
                      {heroHeroProduct.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#F3E5AB]">
                      ${heroHeroProduct.price}
                    </p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/10 group-hover/card:bg-[#D4AF37] group-hover/card:text-black transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium">
                <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Limited Runway Release</span>
              </div>
            </div>

            {/* Decorative Offset Backdrop Accent */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-3xl border border-[#D4AF37]/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
