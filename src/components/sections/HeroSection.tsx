'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/data/mockData';

export default function HeroSection() {
  const { setQuickViewProduct, formatPrice } = useStore();

  // Curated hero showcase featuring Bags, Wristwatches, and Wears that crossfade
  const heroSlides = [
    {
      id: 'slide-1',
      productId: 'watch-01',
      title: 'Precision Swiss Chronographs',
      subtitle: '18k Rose Gold & Automatic Calibre',
      category: 'Wristwatches',
      image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1600&auto=format&fit=crop',
      badge: 'Master Horology Drop',
    },
    {
      id: 'slide-2',
      productId: 'bag-01',
      title: 'Hand-Burnished Italian Leather',
      subtitle: 'Structured Croc-Embossed Calfskin',
      category: 'Designer Bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop',
      badge: 'Florence Atelier',
    },
    {
      id: 'slide-3',
      productId: 'apparel-01',
      title: 'Mulberry Silk Architectural Wears',
      subtitle: 'Fluid Bias-Cut Backless Silhouette',
      category: 'Wears',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1600&auto=format&fit=crop',
      badge: 'Runway Collection',
    },
    {
      id: 'slide-4',
      productId: 'watch-02',
      title: 'Astral Diamond Skeleton Dial',
      subtitle: 'Open-worked Movement with 12 Diamonds',
      category: 'Wristwatches',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      badge: 'Limited Allocation',
    },
    {
      id: 'slide-5',
      productId: 'bag-02',
      title: 'Sienna Chevron Quilted Chain Bag',
      subtitle: 'Plush Nappa Lambskin in Ivory & Gold',
      category: 'Designer Bags',
      image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1600&auto=format&fit=crop',
      badge: 'New Season Arrival',
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-play crossfade animation every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const currentSlide = heroSlides[currentSlideIndex];
  const activeProduct = PRODUCTS.find((p) => p.id === currentSlide.productId) || PRODUCTS[0];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section id="home" className="relative overflow-hidden pt-6 sm:pt-8 pb-8 sm:pb-12 lg:py-16 bg-gradient-to-b from-[#0D0F14] via-[#10131A] to-[#0D0F14]">
      {/* Ambient background glows — contained to avoid mobile overflow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-amber-900/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Editorial Headline & CTAs (Spans 4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col items-start text-left w-full min-w-0">
            {/* Top Pill — fluid */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F3E5AB] text-[11px] sm:text-xs font-medium mb-4 sm:mb-5 backdrop-blur-md max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="tracking-wide truncate">Bags &bull; Wears &bull; Wristwatches</span>
            </div>

            {/* Main Headline — fluid clamp for mobile */}
            <h1 className="font-serif text-[clamp(28px,7vw,36px)] sm:text-5xl lg:text-[42px] xl:text-5xl font-light text-white tracking-tight leading-[1.12] sm:leading-[1.14] mb-3 sm:mb-4 w-full">
              Elegance That Is <br />
              <span className="italic font-normal gold-gradient-text">Truly Timeless</span>.
            </h1>

            {/* Subtext — fluid */}
            <p className="text-[13px] sm:text-sm text-gray-300 max-w-[32ch] sm:max-w-sm font-light leading-relaxed mb-5 sm:mb-6">
              Explore an extraordinary curation of hand-stitched Italian leather bags, bespoke wears, sculpted footwear, Swiss automatic wristwatches, and fine jewelry.
            </p>

            {/* CTAs — 44px min hit, fluid full-width on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6 sm:mb-8">
              <a
                href="#categories"
                className="py-3.5 sm:py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:brightness-95 active:scale-[0.98] transition-all shadow-xl shadow-[#D4AF37]/10 min-h-[44px] touch-manipulation"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>

              <a
                href="#lookbook"
                className="py-3.5 sm:py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-white font-medium text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
              >
                <span>View Lookbook</span>
              </a>
            </div>

            {/* Trust Proof Badges — fluid grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 sm:pt-6 border-t border-white/10 w-full max-w-[320px] sm:max-w-sm text-left">
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-white font-serif text-base sm:text-lg font-bold">
                  <span>50k+</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-0.5 leading-tight">
                  Clients
                </p>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1 text-white font-serif text-base sm:text-lg font-bold">
                  <span>100%</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-0.5 leading-tight">
                  Authentic
                </p>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[#D4AF37] font-serif text-base sm:text-lg font-bold">
                  <span>4.9★</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-0.5 leading-tight">
                  Rating
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Expansive Widescreen Animation Box (Spans 8 cols on lg) — fluid aspect */}
          <div className="lg:col-span-8 relative w-full min-w-0">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#161922] group">
              {/* Slides Container (Fading in & out) */}
              {heroSlides.map((slide, idx) => {
                const isActive = currentSlideIndex === idx;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none scale-105'
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      className="object-cover object-center"
                    />
                    {/* Cinematic dark gradient vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30" />
                  </div>
                );
              })}

              {/* Navigation Arrows — 44px hit target, fluid */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 active:bg-black text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-lg touch-manipulation"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 active:bg-black text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-lg touch-manipulation"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Top Floating Badge — fluid */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white text-[10px] sm:text-[11px] font-medium shadow-lg max-w-[70%]">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] shrink-0" />
                <span className="truncate">{currentSlide.badge}</span>
              </div>

              {/* Floating Active Product Card (Bottom) — fluid */}
              <div
                onClick={() => setQuickViewProduct(activeProduct)}
                className="absolute bottom-10 sm:bottom-12 inset-x-3 sm:inset-x-4 lg:inset-x-8 z-20 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl glass-panel text-white cursor-pointer hover:border-[#D4AF37]/50 active:scale-[0.98] transition-all flex items-center justify-between gap-2 sm:gap-3 group/card shadow-2xl touch-manipulation min-h-[72px]"
              >
                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                    <Image
                      src={activeProduct.primaryImage}
                      alt={activeProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block truncate">
                      {activeProduct.categoryLabel}
                    </span>
                    <h3 className="text-[13px] sm:text-sm lg:text-base font-serif font-medium text-white line-clamp-1">
                      {activeProduct.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#F3E5AB]">
                      {formatPrice(activeProduct.price)}
                    </p>
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 group-hover/card:bg-[#D4AF37] group-hover/card:text-black transition-colors shrink-0 flex items-center gap-1 text-xs font-semibold min-h-[36px] min-w-[36px] justify-center">
                  <span className="hidden sm:inline">Inspect</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Slide Indicator Dots — larger hit */}
              <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5 sm:gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 sm:h-1.5 rounded-full transition-all duration-500 cursor-pointer touch-manipulation min-w-[8px] min-h-[8px] ${
                      currentSlideIndex === idx ? 'w-6 sm:w-8 bg-[#D4AF37]' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Decorative Offset Backdrop Accent */}
            <div className="hidden sm:block absolute -bottom-3 -right-3 -z-10 w-full h-full rounded-3xl border border-[#D4AF37]/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
