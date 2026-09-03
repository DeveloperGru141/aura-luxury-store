'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sparkles, Eye, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { Product } from '@/types/store';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

interface WatchHeroItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  image: string;
  dialImage: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  productRef?: Product;
}

const FALLBACK_WATCHES: WatchHeroItem[] = [
  {
    id: 'watch-hero-1',
    name: 'Chronex Nova Chrono Rose Gold',
    subtitle: 'Swiss precision meets modern luxury.',
    category: 'Wristwatches',
    price: 1249000,
    image: '/images/watches/watch-1.jpg',
    dialImage: '/images/watches/dials/dial-1.png',
    colors: [
      { name: 'Rose Gold', hex: '#B76E79' },
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Obsidian', hex: '#111111' },
      { name: 'Silver', hex: '#DCDFE3' },
    ],
    sizes: ['40', '42', '44', '46'],
  },
  {
    id: 'watch-hero-2',
    name: 'Grand Nautique 300M Diver',
    subtitle: 'Ceramic bezel automatic with sapphire exhibition back.',
    category: 'Wristwatches',
    price: 980000,
    image: '/images/watches/watch-2.jpg',
    dialImage: '/images/watches/dials/dial-2.png',
    colors: [
      { name: 'Midnight Navy', hex: '#1E293B' },
      { name: 'Stealth Black', hex: '#0F172A' },
      { name: 'Brushed Steel', hex: '#94A3B8' },
    ],
    sizes: ['41', '43', '45'],
  },
  {
    id: 'watch-hero-3',
    name: 'Astral Diamond Skeleton Dial',
    subtitle: 'Open-worked titanium calibre with brilliant-cut indices.',
    category: 'Wristwatches',
    price: 1850000,
    image: '/images/watches/watch-3.jpg',
    dialImage: '/images/watches/dials/dial-3.png',
    colors: [
      { name: 'Titanium Grey', hex: '#475569' },
      { name: 'Anthracite', hex: '#334155' },
      { name: 'Pure Platinum', hex: '#E2E8F0' },
    ],
    sizes: ['40', '42', '44'],
  },
  {
    id: 'watch-hero-4',
    name: 'Imperial Heritage Chronograph',
    subtitle: 'Column-wheel mechanism in hand-burnished cordovan leather.',
    category: 'Wristwatches',
    price: 1420000,
    image: '/images/watches/watch-4.jpg',
    dialImage: '/images/watches/dials/dial-4.png',
    colors: [
      { name: 'Cognac Leather', hex: '#78350F' },
      { name: 'Espresso', hex: '#451A03' },
      { name: 'Gilded Gold', hex: '#CA8A04' },
    ],
    sizes: ['39', '41', '43'],
  },
  {
    id: 'watch-hero-5',
    name: 'Geneva Royal Fluted Automatic',
    subtitle: '18k yellow gold fluted bezel with jubilee link bracelet.',
    category: 'Wristwatches',
    price: 1650000,
    image: '/images/watches/watch-5.jpg',
    dialImage: '/images/watches/dials/dial-5.png',
    colors: [
      { name: '18k Yellow Gold', hex: '#EAB308' },
      { name: 'Two-Tone Steel', hex: '#CBD5E1' },
      { name: 'Warm Champagne', hex: '#FDE047' },
    ],
    sizes: ['36', '40', '41'],
  },
  {
    id: 'watch-hero-6',
    name: 'Monaco Vintage Sport Tachymeter',
    subtitle: 'Perforated rally leather strap with bi-compax panda dial.',
    category: 'Wristwatches',
    price: 1380000,
    image: '/images/watches/watch-6.jpg',
    dialImage: '/images/watches/dials/dial-6.png',
    colors: [
      { name: 'Panda White', hex: '#F8FAFC' },
      { name: 'Racing Black', hex: '#18181B' },
      { name: 'Amber Glow', hex: '#D97706' },
    ],
    sizes: ['40', '42', '44'],
  },
];

export default function HeroSection() {
  const { setQuickViewProduct, formatPrice } = useStore();
  const { products: liveProducts } = useLiveProducts();

  // Combine live Supabase products with fallback to always ensure 6 clean luxury items
  const heroItems: WatchHeroItem[] = useMemo(() => {
    if (!liveProducts || liveProducts.length === 0) {
      return FALLBACK_WATCHES;
    }

    // Filter or prioritize watches first, then any luxury products
    const watches = liveProducts.filter(
      (p) => p.category === 'watches' || p.categoryLabel?.toLowerCase().includes('watch')
    );
    const pool = watches.length >= 3 ? watches : liveProducts;

    const mappedLive: WatchHeroItem[] = pool.slice(0, 6).map((p, idx) => {
      const fallback = FALLBACK_WATCHES[idx % FALLBACK_WATCHES.length];
      const imageSrc =
        p.primaryImage ||
        (p as any).images?.[0] ||
        fallback.image;

      return {
        id: p.id,
        name: p.name,
        subtitle: p.tagline || (p.description ? p.description.slice(0, 55) + '...' : fallback.subtitle),
        category: p.categoryLabel || 'Wristwatches',
        price: Number(p.price) || fallback.price,
        image: imageSrc,
        dialImage: fallback.dialImage, // Clean isolated dial matching the model's hand angle
        colors: p.colors && p.colors.length > 0 ? p.colors : fallback.colors,
        sizes: p.sizes && p.sizes.length > 0 ? p.sizes : fallback.sizes,
        productRef: p,
      };
    });

    // If fewer than 6 live products, pad with remaining fallbacks
    if (mappedLive.length < 6) {
      const remaining = FALLBACK_WATCHES.slice(mappedLive.length);
      return [...mappedLive, ...remaining];
    }

    return mappedLive;
  }, [liveProducts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const activeItem = heroItems[currentIndex % heroItems.length];

  // Auto-select first color & size when active item changes
  useEffect(() => {
    if (activeItem) {
      setSelectedColor(activeItem.colors[0]?.name || '');
      setSelectedSize(activeItem.sizes[0] || '40');
    }
  }, [currentIndex, activeItem]);

  // Auto-play timer every 4.5 seconds (smooth rotation between the 6 items)
  useEffect(() => {
    if (isPaused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setInterval(() => {
      if (document.hidden) return;
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [heroItems.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStartX(null);
  };

  // WhatsApp order link with pre-filled message
  const whatsappOrderUrl = getWhatsAppOrderUrl(
    activeItem.name,
    formatPrice(activeItem.price),
    selectedColor,
    selectedSize ? `${selectedSize}mm` : undefined
  );

  return (
    <section
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden bg-[#F4F0E8] text-[#1A1A1A] border-b border-[#E8E4DA] select-none"
    >
      {/* 1. TOP EDITORIAL BRAND BANNER (As seen in reference image) */}
      <div className="pt-4 sm:pt-6 pb-2 px-4 sm:px-8 border-b border-[#E5DFD3]/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Main Giant Serif Header across top */}
          <div className="w-full text-center">
            <h2 className="font-serif text-[clamp(2rem,6.5vw,5.2rem)] font-light tracking-[0.14em] uppercase text-[#141414] leading-none transition-all">
              TIMELESS <span className="italic font-normal text-[#B8941F]">WATCHES</span>
            </h2>
          </div>
        </div>

        {/* Minimalist category quick links beneath header */}
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 sm:gap-10 pt-2 pb-1 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium text-stone-600">
          <a href="#catalogue" className="hover:text-black transition-colors">Shop</a>
          <span className="text-stone-300">&bull;</span>
          <a href="#catalogue" className="hover:text-black transition-colors">New Arrivals</a>
          <span className="text-stone-300">&bull;</span>
          <a href="#catalogue" className="hover:text-black transition-colors text-[#B8941F] font-bold">Timepieces</a>
          <span className="text-stone-300">&bull;</span>
          <a href="#lookbook" className="hover:text-black transition-colors">Lookbook</a>
        </div>
      </div>

      {/* 2. MAIN HERO WORKSPACE (Model in Center + Left Headline + Right Card + Bottom 6 Thumbnails) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 relative min-h-[640px] lg:min-h-[720px] flex flex-col justify-between">
        
        {/* Main Grid: Left copy, Center Model with Watch on Hand, Right Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10 my-auto">
          
          {/* ================= LEFT COLUMN: Headline & CTAs ================= */}
          <div className="lg:col-span-4 flex flex-col items-start text-left z-20 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE3D6] text-stone-700 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase mb-4">
              <Sparkles className="w-3 h-3 text-[#B8941F]" />
              <span>Swiss Mechanical Craftsmanship</span>
            </div>

            <h1 className="font-serif text-[34px] sm:text-5xl lg:text-[52px] font-light text-[#121212] tracking-tight leading-[1.05] mb-3 sm:mb-4">
              Master Your <br />
              <span className="font-normal italic text-[#B8941F]">Time Today</span>
            </h1>

            <p className="text-[13px] sm:text-[14px] text-stone-600 font-light leading-relaxed max-w-sm mb-6">
              Precision-crafted watches for confident leaders. Sourced directly from Swiss horology calibres, inspected in Ilorin with insured courier delivery worldwide.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 w-full sm:w-auto mb-6">
              <a
                href="#catalogue"
                className="py-3.5 px-7 rounded-lg bg-[#141414] hover:bg-black active:scale-[0.98] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all min-h-[44px]"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#heritage"
                className="py-3.5 px-5 rounded-lg bg-white/70 hover:bg-white border border-[#DDD6C8] text-stone-800 text-xs font-medium tracking-wide flex items-center justify-center min-h-[44px] transition-all shadow-sm"
              >
                <span>Our Heritage</span>
              </a>
            </div>

            {/* Circular Prev / Next Buttons (As seen in reference image) */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white border border-[#DCD5C7] text-stone-800 hover:text-black hover:border-black active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Previous timepiece"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-[#141414] text-white hover:bg-black active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Next timepiece"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-stone-500 font-medium ml-2">
                0{currentIndex + 1} / 0{heroItems.length}
              </span>
            </div>
          </div>

          {/* ================= CENTER: MODEL WITH WATCH CHANGING ON HAND ================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[380px] sm:min-h-[480px] lg:min-h-[580px] order-1 lg:order-2">
            {/* Model Canvas Container */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] mx-auto flex items-center justify-center">
              
              {/* Base Model Image (Photorealistic male model in navy dotted shirt buttoning cuff) */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-black/5 bg-[#EDE6DC]">
                <Image
                  src="/images/watch-model-hero.jpg"
                  alt="TIMELESS Watch Model"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />

                {/* Soft ambient studio vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                {/* ================= DYNAMIC TIMEPIECE ON MODEL'S WRIST ================= */}
                {/* 
                  Positioned at the exact wrist cuff position of the model:
                  left: 53.3%, top: 64.7%
                */}
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group/wrist"
                  style={{ left: '53.3%', top: '64.7%' }}
                  onClick={() => activeItem.productRef && setQuickViewProduct(activeItem.productRef)}
                  title={`Active timepiece: ${activeItem.name}`}
                >
                  {/* Subtle luxury pulse radar beacon on wrist */}
                  <span className="absolute -inset-1 rounded-full bg-[#D4AF37] opacity-60 animate-ping" />
                  
                  {/* Active Watch Dial overlay - smoothly transitions when activeItem changes */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeItem.id}
                      initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.1, rotate: 8 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-2xl border-2 border-[#D4AF37] bg-black/80 flex items-center justify-center p-0.5"
                    >
                      <Image
                        src={activeItem.dialImage || activeItem.image}
                        alt={`${activeItem.name} on wrist`}
                        fill
                        className="object-cover rounded-full"
                        sizes="64px"
                      />
                      {/* Luxury glass sheen reflection */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/40 pointer-events-none rounded-full" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Interactive wrist tooltip badge */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 text-white text-[9px] font-medium tracking-wide uppercase px-2 py-0.5 rounded shadow-lg opacity-0 group-hover/wrist:opacity-100 transition-opacity pointer-events-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span>View on wrist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: FLOATING PRODUCT INSPECTOR CARD ================= */}
          <div className="lg:col-span-3 flex flex-col justify-center items-center lg:items-end z-20 order-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full max-w-[340px] bg-white rounded-2xl shadow-xl border border-[#E5E0D5] p-5 sm:p-6 text-left relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] tracking-[0.2em] font-bold uppercase text-[#B8941F] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8941F]" />
                    <span>Swiss Calibre</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    In Stock
                  </span>
                </div>

                {/* Product Title */}
                <h3 className="font-serif text-lg sm:text-xl font-medium text-[#111] leading-tight mb-1">
                  {activeItem.name}
                </h3>

                {/* Tagline */}
                <p className="text-xs text-stone-500 font-light leading-relaxed mb-4 line-clamp-2">
                  {activeItem.subtitle}
                </p>

                {/* Price */}
                <div className="text-2xl font-serif font-bold text-[#141414] tracking-tight mb-4 pb-3 border-b border-stone-100">
                  {formatPrice(activeItem.price)}
                </div>

                {/* Color Swatches */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-stone-500 mb-2">
                    <span>Colour</span>
                    <span className="text-stone-800 font-bold capitalize">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeItem.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                          selectedColor === c.name
                            ? 'border-black ring-2 ring-[#B8941F] scale-110'
                            : 'border-white hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={`Select ${c.name} color`}
                      />
                    ))}
                  </div>
                </div>

                {/* Case Size Pills */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-stone-500 mb-2">
                    <span>Case Size (mm)</span>
                    <span className="text-stone-800 font-bold">{selectedSize}mm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {activeItem.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`flex-1 py-1.5 px-2 rounded border text-xs font-semibold text-center transition-all cursor-pointer ${
                          selectedSize === s
                            ? 'bg-[#141414] text-white border-black shadow-sm'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: WhatsApp Direct Order + Quick View */}
                <div className="space-y-2">
                  <a
                    href={whatsappOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#141414] hover:bg-black active:scale-[0.98] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span>Order on WhatsApp</span>
                  </a>

                  {activeItem.productRef && (
                    <button
                      onClick={() => setQuickViewProduct(activeItem.productRef!)}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-800 font-medium text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-600" />
                      <span>Full Specifications</span>
                    </button>
                  )}
                </div>

                {/* Trust guarantee micro-proof */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 font-medium pt-3 mt-3 border-t border-stone-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8941F]" />
                  <span>100% Genuine • Lifetime Setting Guarantee</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ================= 3. BOTTOM RIGHT: SLIDE INDICATOR + 6 CLEAN THUMBNAILS ================= */}
        {/* Exactly matching reference image bottom row with six clean product images */}
        <div className="pt-6 sm:pt-8 mt-6 border-t border-[#E3DDCF] flex flex-col md:flex-row items-center justify-between gap-4 z-20">
          
          {/* Left: Assurance statement */}
          <div className="flex items-center gap-4 text-xs text-stone-600 font-light">
            <span className="font-semibold text-black tracking-wider uppercase text-[11px]">Direct Atelier</span>
            <span className="text-stone-300">&bull;</span>
            <span>Every timepiece inspected in Ilorin before dispatch</span>
          </div>

          {/* Right: Numbered Progress Line + 6 Clean Watch Thumbnails */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
            
            {/* Numbered Progress Indicators: 01 ——— 02 03 04 05 06 */}
            <div className="flex items-center gap-2 text-xs font-serif font-medium tracking-widest text-stone-600">
              {heroItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${
                    currentIndex === idx ? 'text-black font-bold' : 'text-stone-400 hover:text-stone-600'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                >
                  <span>0{idx + 1}</span>
                  {currentIndex === idx && (
                    <span className="w-4 h-px bg-black inline-block ml-0.5" />
                  )}
                </button>
              ))}
            </div>

            {/* SIX CLEAN PRODUCT THUMBNAIL TILES (As seen in reference image) */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full pb-1">
              {heroItems.map((item, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-xl bg-white border transition-all cursor-pointer shrink-0 p-1 flex items-center justify-center overflow-hidden ${
                      isActive
                        ? 'border-[#B8941F] ring-2 ring-[#B8941F]/40 shadow-lg scale-105'
                        : 'border-[#DDD6C8] hover:border-black opacity-75 hover:opacity-100 hover:scale-102 shadow-sm'
                    }`}
                    aria-label={`Select ${item.name}`}
                  >
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                        sizes="72px"
                      />
                    </div>
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
