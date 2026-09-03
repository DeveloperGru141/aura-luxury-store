'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
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
  cutout: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  productRef?: Product;
}

// Preserved bag accessory card
const BAG_IMAGE_CARD = {
  id: 'bag-01',
  name: 'Monceau Croc-Embossed Structured Satchel',
  tagline: 'Hand-stitched Full-Grain Italian Leathers',
  category: 'Designer Bags',
  price: 420000,
  image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
};

export default function HeroSection() {
  const { setQuickViewProduct, formatPrice } = useStore();
  const { products: liveProducts } = useLiveProducts();

  // Six wristwatches sourced primarily from live Supabase products
  const heroItems: WatchHeroItem[] = useMemo(() => {
    if (liveProducts && liveProducts.length > 0) {
      // Prioritize live wristwatches, otherwise fall back to any available live products
      const watches = liveProducts.filter(
        (p) => p.category === 'watches' || p.categoryLabel?.toLowerCase().includes('watch')
      );
      const sourcePool = watches.length >= 3 ? watches : liveProducts;

      return sourcePool.slice(0, 6).map((p, idx) => {
        const num = (idx % 6) + 1;
        const imageSrc = p.primaryImage || (p as any).images?.[0] || `/images/watches/watch-${num}.jpg`;
        return {
          id: p.id,
          name: p.name,
          subtitle: p.tagline || (p.description ? p.description.slice(0, 50) + '...' : 'Swiss precision movement'),
          category: p.categoryLabel || 'Wristwatches',
          price: Number(p.price) || 1250000,
          image: imageSrc,
          cutout: `/images/watches/cutouts/watch-cutout-${num}.png`,
          colors: p.colors && p.colors.length > 0 ? p.colors : [{ name: 'Gold', hex: '#D4AF37' }, { name: 'Obsidian', hex: '#111111' }],
          sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['40', '42', '44'],
          productRef: p,
        };
      });
    }

    // Default 6 items with clean cutouts when database is loading/connecting
    const titles = [
      'Chronex Nova Chrono Rose Gold',
      'Grand Nautique 300M Diver',
      'Astral Diamond Skeleton Dial',
      'Imperial Heritage Chronograph',
      'Geneva Royal Fluted Automatic',
      'Monaco Vintage Sport Tachymeter',
    ];
    const subtitles = [
      'Swiss precision meets modern luxury.',
      'Ceramic bezel automatic with sapphire case back.',
      'Open-worked titanium calibre with brilliant indices.',
      'Column-wheel mechanism in hand-burnished leather.',
      '18k yellow gold fluted bezel with jubilee bracelet.',
      'Perforated rally leather strap with panda dial.',
    ];
    const prices = [1249000, 980000, 1850000, 1420000, 1650000, 1380000];

    return Array.from({ length: 6 }, (_, idx) => {
      const num = idx + 1;
      return {
        id: `hero-watch-${num}`,
        name: titles[idx],
        subtitle: subtitles[idx],
        category: 'Wristwatches',
        price: prices[idx],
        image: `/images/watches/watch-${num}.jpg`,
        cutout: `/images/watches/cutouts/watch-cutout-${num}.png`,
        colors: [
          { name: 'Rose Gold', hex: '#B76E79' },
          { name: 'Obsidian', hex: '#111111' },
          { name: 'Champagne Gold', hex: '#D4AF37' },
        ],
        sizes: ['40', '42', '44', '46'],
      };
    });
  }, [liveProducts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const activeItem = heroItems[currentIndex % heroItems.length];

  // Auto-switch every 4.5s (pauses on hover)
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
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStartX(null);
  };

  // WhatsApp order link
  const whatsappOrderUrl = getWhatsAppOrderUrl(
    activeItem.name,
    formatPrice(activeItem.price),
    activeItem.colors[0]?.name,
    activeItem.sizes[0] ? `${activeItem.sizes[0]}mm` : undefined
  );

  return (
    <section
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden bg-[#F4F0E8] text-[#1A1A1A] border-b border-[#E8E4DA] select-none py-8 sm:py-12 lg:py-16"
    >
      {/* ================= 1. EDITORIAL TYPOGRAPHY: LARGE LOW-OPACITY WATERMARK IN BACKGROUND ================= */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-serif text-[clamp(4.5rem,15vw,14rem)] font-extralight tracking-[0.18em] uppercase text-black/[0.035] whitespace-nowrap leading-none select-none">
          OMO ESHO SIGNATURES
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* EDITORIAL SPLIT-SCREEN LAYOUT: Left Copy | Center Stage Model | Right Controls & Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-center">
          
          {/* ================= LEFT COLUMN: HERO TEXT FROM PREVIOUS COMMIT ================= */}
          <div className="lg:col-span-4 flex flex-col items-start text-left z-20 order-2 lg:order-1">
            {/* Eyebrow */}
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#B8941F] mb-3">
              Based in ilorin genuine leather,wears and swiss sourced timepieces
            </p>

            {/* Headline */}
            <h1 className="font-serif text-[38px] sm:text-5xl lg:text-[52px] font-light text-black tracking-tight leading-[0.98] mb-4">
              Genuine pieces,<br />
              <span className="italic font-normal text-[#B8941F]">curated from Ilorin.</span>
            </h1>

            {/* Body */}
            <p className="text-[14px] text-stone-700 max-w-[38ch] font-light leading-relaxed mb-7">
              Every piece we carry is genuine leather bags,wears,genuine leather and wristwatches sourced directly from various makers,we're based in ilorin where every order is inspected before it ships with insured courier delivery worldwide
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 mb-7 w-full sm:w-auto">
              <a
                href="#catalogue"
                className="py-3.5 px-7 rounded-full bg-black hover:bg-zinc-900 active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all min-h-[44px]"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>

              <a
                href="#lookbook"
                className="py-3.5 px-6 rounded-full bg-white border border-[#DDD6C8] hover:border-black text-black font-medium text-xs uppercase tracking-widest text-center min-h-[44px] flex items-center justify-center transition-all shadow-sm"
              >
                <span>View Lookbook</span>
              </a>
            </div>

            {/* Circular Prev/Next Controls */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white border border-[#DDD6C8] text-black hover:border-black active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Previous timepiece"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-black text-white hover:bg-zinc-800 active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Next timepiece"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-stone-500 font-serif ml-1">
                0{currentIndex + 1} / 0{heroItems.length}
              </span>
            </div>

            {/* Trust Proofs */}
            <div className="flex items-center gap-6 pt-5 border-t border-[#DDD6C8] w-full max-w-sm text-left">
              <div className="flex items-center gap-1.5 text-black font-sans text-[11px] font-bold tracking-widest">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8941F] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B8941F]" />
                </span>
                <span>100% GENUINE</span>
              </div>
              <span className="w-px h-3 bg-[#DDD6C8]" />
              <div className="flex items-center gap-1.5 text-black font-sans text-[11px] font-bold tracking-widest">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8941F] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B8941F]" />
                </span>
                <span>WORLDWIDE INSURED DELIVERY</span>
              </div>
            </div>
          </div>

          {/* ================= 2. CENTER STAGE: RELATIVE WRAPPER WITH BASE MODEL + WRIST ANCHOR ================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[420px] sm:min-h-[500px] lg:min-h-[580px] order-1 lg:order-2">
            
            {/* Center Stage: Relative wrapper containing the static base model image */}
            <div className="relative w-full max-w-[450px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-[#EDE6DC] border border-black/5 mx-auto">
              
              {/* Base Model Image (Static, without watch) */}
              <Image
                src="/images/model-bare-wrist.jpg"
                alt="Omo Esho Signatures Model"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 90vw, 42vw"
              />

              {/* Soft studio ambient light */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* ================= 3. WRIST ANCHOR: top: 65%, left: 51%, w-[110px] to w-[130px] ================= */}
              <div
                className="absolute z-30 pointer-events-auto -translate-x-1/2 -translate-y-1/2 w-[110px] sm:w-[120px] lg:w-[130px] aspect-square flex items-center justify-center"
                style={{
                  top: '65%',
                  left: '51%',
                }}
                onClick={() => activeItem.productRef && setQuickViewProduct(activeItem.productRef)}
                title={`Active watch: ${activeItem.name}`}
              >
                {/* ================= 4. SMOOTH SWITCH: Framer Motion AnimatePresence ================= */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.15, rotate: 10 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] cursor-pointer"
                  >
                    <Image
                      src={activeItem.cutout}
                      alt={`${activeItem.name} on wrist`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Subtle golden beacon pulse */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#B8941F] opacity-75 animate-ping pointer-events-none" />
              </div>

              {/* Preserved Floating Bag Accessory Card */}
              <div className="absolute bottom-3 left-3 z-20 p-2 sm:p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#DDD6C8] shadow-md flex items-center gap-2.5 max-w-[240px]">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  <Image src={BAG_IMAGE_CARD.image} alt={BAG_IMAGE_CARD.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] uppercase tracking-wider font-bold text-[#B8941F] block truncate">
                    {BAG_IMAGE_CARD.category}
                  </span>
                  <p className="text-[11px] font-medium text-black line-clamp-1 leading-tight">
                    {BAG_IMAGE_CARD.name}
                  </p>
                  <p className="text-[11px] font-semibold text-stone-800">
                    {formatPrice(BAG_IMAGE_CARD.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 5. INTERACTIVE CONTROLS: METADATA CARD & 6-THUMBNAIL SELECTOR GRID ================= */}
          <div className="lg:col-span-3 flex flex-col justify-center z-20 order-3 space-y-4">
            
            {/* Dynamic Product Metadata Card (Name, Price in NGN, Category) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DDD6C8] shadow-lg text-left relative overflow-hidden"
              >
                {/* Category & Status */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#B8941F] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B8941F]" />
                    <span>{activeItem.category}</span>
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active on Wrist
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="font-serif text-base sm:text-lg font-medium text-black leading-tight mb-1 line-clamp-1">
                  {activeItem.name}
                </h3>

                {/* Subtitle */}
                <p className="text-[11px] text-stone-500 font-light line-clamp-1 mb-3">
                  {activeItem.subtitle}
                </p>

                {/* Price in NGN */}
                <div className="text-xl sm:text-2xl font-serif font-bold text-black tracking-tight pb-3 mb-3 border-b border-stone-100 flex items-baseline justify-between">
                  <span>{formatPrice(activeItem.price)}</span>
                  <span className="text-[10px] font-sans font-normal text-stone-500">NGN / Insured</span>
                </div>

                {/* WhatsApp Order Button */}
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-zinc-900 active:scale-[0.98] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Order on WhatsApp</span>
                </a>
              </motion.div>
            </AnimatePresence>

            {/* 6-Thumbnail Selector Grid */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-stone-600">
                  Select Timepiece (0{currentIndex + 1}/06)
                </span>
                <span className="text-[10px] text-stone-400">Click to switch</span>
              </div>

              {/* 2x3 or 3x2 Grid of 6 Clean Thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                {heroItems.map((item, idx) => {
                  const isActive = currentIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative aspect-square rounded-xl bg-white border p-1 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
                        isActive
                          ? 'border-[#B8941F] ring-2 ring-[#B8941F]/40 shadow-md scale-[1.03]'
                          : 'border-[#DDD6C8] hover:border-black opacity-75 hover:opacity-100 shadow-sm'
                      }`}
                      aria-label={`Select ${item.name}`}
                    >
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-0.5"
                          sizes="80px"
                        />
                      </div>

                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute bottom-0 inset-x-1 h-0.5 bg-[#B8941F] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Micro-guarantee */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 font-light pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8941F]" />
              <span>Omo Esho Signatures • 100% Inspected</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
