'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { Product } from '@/types/store';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

/**
 * 6 Timepiece Products matching image_9.png and reference images
 */
interface WatchProduct {
  id: string;
  brand: string;
  name: string;
  subtitle: string;
  price: number;
  overlayCutout: string;
  thumbnail: string;
  category: string;
  productRef?: Product;
}

const DEFAULT_SIX_WATCHES: WatchProduct[] = [
  {
    id: 'patek-orange',
    brand: 'MATEK PHILIPPE',
    name: 'Patek Philippe',
    subtitle: 'Swiss precision movement',
    price: 240000,
    overlayCutout: '/images/watches/overlay-1.png', // Patek Philippe orange rubber strap
    thumbnail: '/images/watches/thumb-5.jpg',
    category: 'Wristwatches',
  },
  {
    id: 'rolex-tiffany',
    brand: 'ROLEX GENEVE',
    name: 'Oyster Perpetual Tiffany',
    subtitle: 'Turquoise celebration dial calibre',
    price: 285000,
    overlayCutout: '/images/watches/overlay-2.png',
    thumbnail: '/images/watches/thumb-4.jpg',
    category: 'Wristwatches',
  },
  {
    id: 'audemars-black',
    brand: 'AUDEMARS PIGUET',
    name: 'Royal Oak Offshore Chrono',
    subtitle: 'Stealth black ceramic bezel automatic',
    price: 350000,
    overlayCutout: '/images/watches/overlay-3.png',
    thumbnail: '/images/watches/thumb-1.jpg',
    category: 'Wristwatches',
  },
  {
    id: 'datejust-diamond',
    brand: 'ROLEX GENEVE',
    name: 'Datejust Two-Tone Diamond',
    subtitle: 'Fluted 18k bezel with jubilee bracelet',
    price: 310000,
    overlayCutout: '/images/watches/overlay-4.png',
    thumbnail: '/images/watches/thumb-2.jpg',
    category: 'Wristwatches',
  },
  {
    id: 'nautilus-rose',
    brand: 'PATEK PHILIPPE',
    name: 'Nautilus Annual Calendar',
    subtitle: 'Hand-burnished warm rose gold casing',
    price: 420000,
    overlayCutout: '/images/watches/overlay-5.png',
    thumbnail: '/images/watches/thumb-6.jpg',
    category: 'Wristwatches',
  },
  {
    id: 'astral-skeleton',
    brand: 'SWISS CALIBRE',
    name: 'Astral Skeleton Tourbillon',
    subtitle: 'Open-worked titanium mechanical calibre',
    price: 380000,
    overlayCutout: '/images/watches/overlay-6.png',
    thumbnail: '/images/watches/thumb-3.jpg',
    category: 'Wristwatches',
  },
];

export default function HeroSection() {
  const { setQuickViewProduct, formatPrice } = useStore();
  const { products: liveProducts } = useLiveProducts();

  // Combine live Supabase products with the 6 watches
  const watchProducts: WatchProduct[] = useMemo(() => {
    if (liveProducts && liveProducts.length > 0) {
      const watches = liveProducts.filter(
        (p) => p.category === 'watches' || p.categoryLabel?.toLowerCase().includes('watch')
      );
      const sourcePool = watches.length >= 3 ? watches : liveProducts;

      return DEFAULT_SIX_WATCHES.map((fallback, idx) => {
        const liveP = sourcePool[idx];
        if (!liveP) return fallback;

        return {
          id: liveP.id,
          brand: (liveP as any).brand || fallback.brand,
          name: liveP.name || fallback.name,
          subtitle: liveP.tagline || fallback.subtitle,
          price: Number(liveP.price) || fallback.price,
          overlayCutout: fallback.overlayCutout,
          thumbnail: liveP.primaryImage || (liveP as any).images?.[0] || fallback.thumbnail,
          category: liveP.categoryLabel || 'Wristwatches',
          productRef: liveP,
        };
      });
    }

    return DEFAULT_SIX_WATCHES;
  }, [liveProducts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const activeProduct = watchProducts[currentIndex % watchProducts.length];

  // Auto-advance every 5 seconds (pauses on user interaction)
  useEffect(() => {
    if (isPaused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setInterval(() => {
      if (document.hidden) return;
      setCurrentIndex((prev) => (prev + 1) % watchProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [watchProducts.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % watchProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + watchProducts.length) % watchProducts.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStartX(null);
  };

  // WhatsApp pre-filled order URL (calling +234 706 507 6565)
  const whatsappUrl = getWhatsAppOrderUrl(
    activeProduct.name,
    formatPrice(activeProduct.price)
  );

  return (
    <section
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden bg-[#F4EFE6] text-[#1A1A1A] select-none pt-4 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20 border-b border-[#E7E1D4]"
    >
      {/* ================= 1. LARGE LOW-OPACITY SERIF TEXT WATERMARK ('SIGNATURES') ================= */}
      {/* Positioned across the background behind the model as shown in image_9.png */}
      <div className="absolute inset-x-0 bottom-6 sm:bottom-10 lg:bottom-14 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-serif text-[clamp(4.5rem,19vw,17rem)] font-extralight tracking-[0.16em] uppercase text-[#7D6B5A]/[0.08] whitespace-nowrap leading-none select-none">
          SIGNATURES
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= EXACT THREE-COLUMN STRUCTURE (MATCHING image_9.png) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 xl:gap-8 items-center min-h-[640px] lg:min-h-[720px]">
          
          {/* ================= COLUMN 1: LEFT EDITORIAL COPY & BUTTONS ================= */}
          <div className="lg:col-span-4 flex flex-col items-start text-left z-20 order-2 lg:order-1 pt-4 lg:pt-0">
            {/* Eyebrow */}
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#B8941F] mb-3">
              BASED IN ILORIN GENUINE LEATHER,WEARS AND SWISS SOURCED TIMEPIECES
            </p>

            {/* Headline */}
            <h1 className="font-serif text-[40px] sm:text-5xl lg:text-[56px] font-normal text-black tracking-tight leading-[1.0] mb-4">
              Genuine pieces,<br />
              <span className="italic font-normal text-[#B8941F]">curated from Ilorin.</span>
            </h1>

            {/* Description */}
            <p className="text-[13px] sm:text-[14px] text-stone-700 max-w-[34ch] font-light leading-relaxed mb-7">
              Every piece we carry is genuine leather bags,wears,genuine leather and writswatches sourced directly from various makers,we&apos;re based in Ilorin where every order is inspected before it ships with insured courier delivery worldwide.
            </p>

            {/* CTAs: EXPLORE COLLECTIONS & VIEW LOOKBOOK */}
            <div className="flex items-center gap-3 mb-7 w-full sm:w-auto">
              <a
                href="#catalogue"
                className="py-3.5 px-6 sm:px-7 rounded-full bg-black hover:bg-zinc-800 active:scale-[0.98] text-white font-semibold text-[11px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all min-h-[44px]"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </a>

              <a
                href="#lookbook"
                className="py-3.5 px-6 rounded-full bg-white hover:bg-stone-50 border border-stone-300 hover:border-black text-black font-medium text-[11px] sm:text-xs uppercase tracking-widest text-center min-h-[44px] flex items-center justify-center transition-all shadow-sm"
              >
                <span>VIEW LOOKBOOK</span>
              </a>
            </div>

            {/* Carousel Navigation Counter & Arrows: (<) (>) 01 / 06 */}
            <div className="flex items-center gap-2.5 mb-7">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white border border-stone-300 text-black hover:border-black active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Previous watch"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-black text-white hover:bg-zinc-800 active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Next watch"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-stone-600 font-serif ml-2">
                0{currentIndex + 1} / 0{watchProducts.length}
              </span>
            </div>

            {/* Bottom Features List: 100% GENUINE | WORLDWIDE INSURED */}
            <div className="flex items-center gap-5 pt-5 border-t border-[#DDD6C8] w-full max-w-sm text-left">
              <div className="flex items-center gap-1.5 text-black font-sans text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8941F]" />
                <span>100% GENUINE</span>
              </div>
              <span className="w-px h-3 bg-[#DDD6C8]" />
              <div className="flex items-center gap-1.5 text-black font-sans text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8941F]" />
                <span>WORLDWIDE INSURED</span>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 2: CENTER STAGE - MODEL BASE LAYER + DYNAMIC WRIST OVERLAY ================= */}
          {/* Standing directly on the background (no card frame) as instructed */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[460px] sm:min-h-[540px] lg:min-h-[640px] order-1 lg:order-2">
            
            {/* Center Model Container (No outer card border, standing directly on the canvas) */}
            <div className="relative w-full max-w-[420px] lg:max-w-[460px] aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] flex items-center justify-center mx-auto">
              
              {/* Static Base Model Layer: Bearded man in blue dotted shirt, brown belt, dark trousers */}
              <div className="relative w-full h-full">
                <Image
                  src="/images/model-bare-wrist.jpg"
                  alt="Omo Esho Signatures Model"
                  fill
                  priority
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 90vw, 42vw"
                />

                {/* ================= WRIST OVERLAY LAYER (DYNAMIC TRANSITION) ================= */}
                {/* 
                  Positioned strictly on the model's raised wrist at top: 65% and left: 51% 
                  Sized roughly w-[110px] to w-[130px]
                  Centered with -translate-x-1/2 -translate-y-1/2
                */}
                <div
                  className="absolute z-30 pointer-events-auto -translate-x-1/2 -translate-y-1/2 w-[110px] sm:w-[120px] lg:w-[130px] aspect-square flex items-center justify-center"
                  style={{
                    top: '65%',
                    left: '51%',
                  }}
                  onClick={() => activeProduct.productRef && setQuickViewProduct(activeProduct.productRef)}
                  title={`Click to inspect ${activeProduct.name}`}
                >
                  {/* Framer Motion AnimatePresence: Transitions ONLY within this isolated overlay area on the model's hand */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProduct.id}
                      initial={{ opacity: 0, scale: 0.84, rotate: -8 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.12, rotate: 8 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)] cursor-pointer"
                    >
                      <Image
                        src={activeProduct.overlayCutout}
                        alt={`${activeProduct.name} on wrist`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Subtle golden beacon ping on wrist */}
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#B8941F] opacity-70 animate-ping pointer-events-none" />
                </div>

              </div>
            </div>
          </div>

          {/* ================= COLUMN 3: RIGHT CONTROLS - PRODUCT CARD & 6-THUMBNAIL SELECTOR GRID ================= */}
          <div className="lg:col-span-3 flex flex-col justify-center z-20 order-3 space-y-4 max-w-[340px] mx-auto lg:mx-0 w-full">
            
            {/* Detailed Product Card (Matching image_9.png exactly) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="bg-white rounded-2xl p-5 shadow-lg border border-stone-200/80 text-left relative"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#B8941F] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B8941F]" />
                    <span>{activeProduct.brand}</span>
                  </span>
                  
                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active on Wrist</span>
                  </span>
                </div>

                {/* Product Title */}
                <h3 className="font-serif text-lg sm:text-xl font-medium text-black leading-tight mb-0.5">
                  {activeProduct.name}
                </h3>

                {/* Subtitle */}
                <p className="text-[11px] text-stone-500 font-light mb-3">
                  {activeProduct.subtitle}
                </p>

                {/* Price in NGN */}
                <div className="flex items-baseline justify-between pt-1 pb-3 mb-3 border-b border-stone-100">
                  <span className="font-serif text-2xl font-bold text-black tracking-tight">
                    {formatPrice(activeProduct.price)}
                  </span>
                  <span className="text-[10px] font-sans font-medium text-stone-400">
                    NGN/Insured
                  </span>
                </div>

                {/* Black ORDER ON WHATSAPP Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-black hover:bg-zinc-900 active:scale-[0.98] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>ORDER ON WHATSAPP</span>
                </a>
              </motion.div>
            </AnimatePresence>

            {/* 6-Thumbnail Selector Grid (3 columns x 2 rows as seen in image_9.png) */}
            <div className="bg-transparent pt-1">
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-stone-700">
                  SELECT TIMEPIECE (0{currentIndex + 1}/06)
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Click to switch
                </span>
              </div>

              {/* 3x2 Grid */}
              <div className="grid grid-cols-3 gap-2">
                {watchProducts.map((item, idx) => {
                  const isActive = currentIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative aspect-square rounded-2xl bg-white border transition-all cursor-pointer p-1 flex items-center justify-center overflow-hidden ${
                        isActive
                          ? 'border-[#B8941F] ring-2 ring-[#B8941F]/40 shadow-md scale-[1.03]'
                          : 'border-stone-200/90 hover:border-black opacity-80 hover:opacity-100 shadow-sm'
                      }`}
                      aria-label={`Select ${item.name}`}
                    >
                      <div className="relative w-full h-full rounded-xl overflow-hidden bg-stone-50">
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="85px"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Micro proof: Omo Esho Signatures - 100% Inspected */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 font-light pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8941F]" />
              <span>Omo Esho Signatures &bull; 100% Inspected</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
