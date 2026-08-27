'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PRODUCTS } from '@/data/mockData';
import { useStore } from '@/context/StoreContext';
import { Eye, ShoppingBag, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export default function ShopTheLook() {
  const { setQuickViewProduct, addToCart, formatPrice } = useStore();

  // Multi-product animated crossfade gallery for Wristwatches, Clothes, Shoes, and Bags
  const stylingSlides = [
    {
      id: 'look-1',
      productId: 'watch-01',
      title: 'Precision Swiss Horology',
      description: 'Master automatic chronograph calibre framed in 18k rose gold with sunburst dial.',
      category: 'Wristwatches',
      badge: 'Timepiece Spotlight',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'look-2',
      productId: 'apparel-01',
      title: 'Mulberry Silk Bias-Cut Gown',
      description: 'Architectural cowl-back silhouette in pure 22-momme silk crepe for evening galas.',
      category: 'Wears',
      badge: 'Fine Wears',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'look-3',
      productId: 'shoes-01',
      title: 'Venice Sculpted Ankle-Strap Pumps',
      description: '90mm geometric architectural heel crafted with glazed patent leather and memory-foam arch.',
      category: 'Luxury Shoes',
      badge: 'Footwear Collection',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'look-4',
      productId: 'bag-01',
      title: 'Monceau Croc-Embossed Satchel',
      description: 'Hand-burnished Italian calfskin structured satchel with 24k gold-plated turn-lock hardware.',
      category: 'Designer Bags',
      badge: 'Artisanal Leather',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'look-5',
      productId: 'watch-03',
      title: 'Grand Nautique 300M Diver',
      description: 'Zirconia ceramic bezel automatic diver watch engineered with 300-meter water resistance.',
      category: 'Wristwatches',
      badge: 'Horology Spotlight',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'look-6',
      productId: 'bag-02',
      title: 'Sienna Chevron Quilted Chain Bag',
      description: 'Plush lambskin micro-quilting with sliding gold chain strap for versatile day-to-night styling.',
      category: 'Designer Bags',
      badge: 'New Season Bag',
      image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play crossfade animation every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stylingSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [stylingSlides.length]);

  const currentSlide = stylingSlides[currentIndex];
  const activeProduct = PRODUCTS.find((p) => p.id === currentSlide.productId) || PRODUCTS[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stylingSlides.length) % stylingSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stylingSlides.length);
  };

  return (
    <section id="lookbook" className="py-24 bg-[#0A0C0F] relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Minimalist Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Living Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white">
              Curated <span className="italic font-normal gold-gradient-text">Lookbook</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            A seamless transition of master Swiss wristwatches, bespoke wears, luxury shoes, and handcrafted Italian leather bags.
          </p>
        </div>

        {/* Animated Multi-Product Transition Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Crossfade Frame (Spans 8 cols on lg) */}
          <div className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#14171E] group">
            {/* Crossfade Slides */}
            {stylingSlides.map((slide, idx) => {
              const isActive = currentIndex === idx;
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
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
                </div>
              );
            })}

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-lg"
              aria-label="Previous look"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-lg"
              aria-label="Next look"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Top Badge */}
            <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{currentSlide.badge}</span>
            </div>

            {/* Bottom Floating Title */}
            <div className="absolute bottom-6 inset-x-6 z-20 hidden sm:block pointer-events-none">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
                {currentSlide.category}
              </span>
              <h3 className="font-serif text-2xl font-light text-white">
                {currentSlide.title}
              </h3>
            </div>

            {/* Slide Indicator Dots */}
            <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center items-center gap-2">
              {stylingSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    currentIndex === idx ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to look ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Active Featured Product Inspector */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Active Spotlight Card */}
            {activeProduct && (
              <div className="p-6 rounded-3xl bg-[#13161D] border border-[#D4AF37]/40 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                      {activeProduct.categoryLabel}
                    </span>
                    <span className="text-emerald-400 font-medium text-[11px]">&bull; In Stock</span>
                  </div>

                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-800 mb-4 border border-white/5">
                    <Image
                      src={activeProduct.primaryImage}
                      alt={activeProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="font-serif text-lg font-medium text-white mb-1">
                    {activeProduct.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 mb-4 leading-relaxed font-light">
                    {activeProduct.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-white/5">
                    <span className="text-xs text-gray-400">Price</span>
                    <span className="text-lg font-bold text-[#F3E5AB]">
                      {formatPrice(activeProduct.price)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setQuickViewProduct(activeProduct)}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Quick View</span>
                    </button>

                    <button
                      onClick={() => addToCart(activeProduct)}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 hover:brightness-110 shadow-lg cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Switch List */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block px-2 mb-1">
                Curated Transitions ({stylingSlides.length} Items)
              </span>
              {stylingSlides.map((slide, idx) => {
                const isSelected = currentIndex === idx;
                const prod = PRODUCTS.find((p) => p.id === slide.productId);
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-white font-medium'
                        : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] shrink-0">
                        {slide.category.split(' ')[0]}
                      </span>
                      <span className="font-serif truncate">{slide.title}</span>
                    </div>
                    {prod && (
                      <span className="text-[#F3E5AB] font-semibold shrink-0 ml-2">
                        {formatPrice(prod.price)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
