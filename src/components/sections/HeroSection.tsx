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
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop',
      badge: 'Master Horology Drop',
    },
    {
      id: 'slide-2',
      productId: 'bag-01',
      title: 'Hand-Burnished Italian Leather',
      subtitle: 'Structured Croc-Embossed Calfskin',
      category: 'Designer Bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop',
      badge: 'Florence Atelier',
    },
    {
      id: 'slide-3',
      productId: 'apparel-01',
      title: 'Mulberry Silk Architectural Wears',
      subtitle: 'Fluid Bias-Cut Backless Silhouette',
      category: 'Wears',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1400&auto=format&fit=crop',
      badge: 'Runway Collection',
    },
    {
      id: 'slide-4',
      productId: 'watch-02',
      title: 'Astral Diamond Skeleton Dial',
      subtitle: 'Open-worked Movement with 12 Diamonds',
      category: 'Wristwatches',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1400&auto=format&fit=crop',
      badge: 'Limited Allocation',
    },
    {
      id: 'slide-5',
      productId: 'bag-02',
      title: 'Sienna Chevron Quilted Chain Bag',
      subtitle: 'Plush Nappa Lambskin in Ivory & Gold',
      category: 'Designer Bags',
      image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1400&auto=format&fit=crop',
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
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-24 bg-gradient-to-b from-[#0D0F14] via-[#10131A] to-[#0D0F14]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F3E5AB] text-xs font-medium mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="tracking-wide">Designer Bags &bull; Fine Wears &bull; Luxury Wristwatches</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-light text-white tracking-tight leading-[1.1] mb-6">
              Elegance That Is <br />
              <span className="italic font-normal gold-gradient-text">Truly Timeless</span>.
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-gray-300 max-w-xl font-light leading-relaxed mb-8">
              Explore an extraordinary curation of hand-stitched Italian leather bags, bespoke tailoring and wears, sculpted footwear, Swiss automatic wristwatches, and certified fine jewelry.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="#categories"
                className="py-3.5 px-7 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-[#D4AF37]/10"
              >
                <span>Explore Collections</span>
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
                  Clients Nationwide
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
                  Client Rating
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Fade-In / Fade-Out Animation */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#161922] group">
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
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                  </div>
                );
              })}

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{currentSlide.badge}</span>
              </div>

              {/* Floating Active Product Card (Bottom) */}
              <div
                onClick={() => setQuickViewProduct(activeProduct)}
                className="absolute bottom-12 inset-x-6 z-20 p-4 rounded-2xl glass-panel text-white cursor-pointer hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group/card shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                    <Image
                      src={activeProduct.primaryImage}
                      alt={activeProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#D4AF37]">
                      {activeProduct.categoryLabel}
                    </span>
                    <h3 className="text-xs font-serif font-medium text-white line-clamp-1">
                      {activeProduct.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#F3E5AB]">
                      {formatPrice(activeProduct.price)}
                    </p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/10 group-hover/card:bg-[#D4AF37] group-hover/card:text-black transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Slide Indicator Dots */}
              <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      currentSlideIndex === idx ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
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
