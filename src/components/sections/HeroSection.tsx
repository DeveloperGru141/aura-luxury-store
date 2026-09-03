'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sparkles, Check } from 'lucide-react';
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
  dialImage: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  productRef?: Product;
}

// Preserved mockup product of the bag used as the floating image card
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

  // Primary source: live products from Supabase database
  const heroItems: WatchHeroItem[] = useMemo(() => {
    if (liveProducts && liveProducts.length > 0) {
      // Prioritize watches if available, otherwise use live products
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
          subtitle: p.tagline || (p.description ? p.description.slice(0, 55) + '...' : 'Swiss precision horology'),
          category: p.categoryLabel || 'Wristwatches',
          price: Number(p.price) || 1250000,
          image: imageSrc,
          cutout: `/images/watches/cutouts/watch-cutout-${num}.png`,
          dialImage: `/images/watches/dials/dial-${num}.png`,
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
    const prices = [1249000, 980000, 1850000, 1420000, 1650000, 1380000];

    return Array.from({ length: 6 }, (_, idx) => {
      const num = idx + 1;
      return {
        id: `hero-watch-${num}`,
        name: titles[idx],
        subtitle: 'Swiss precision meets modern luxury.',
        category: 'Wristwatches',
        price: prices[idx],
        image: `/images/watches/watch-${num}.jpg`,
        cutout: `/images/watches/cutouts/watch-cutout-${num}.png`,
        dialImage: `/images/watches/dials/dial-${num}.png`,
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

  // Automatic transition every 4.5s
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

  // WhatsApp direct order link for active wristwatch
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
      className="relative overflow-hidden bg-[#F4F0E8] text-[#1A1A1A] border-b border-[#E8E4DA] select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 relative flex flex-col justify-between min-h-[660px] lg:min-h-[720px]">
        
        {/* 3-COLUMN HERO GRID: Left Copy | Center Bare-Wrist Model with Dynamic Wrist Overlay | Right 6-Item Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10 my-auto">
          
          {/* ================= 1. LEFT COLUMN: EXACT HERO TEXT FROM PREVIOUS COMMIT ================= */}
          <div className="lg:col-span-4 flex flex-col items-start text-left z-20 order-2 lg:order-1">
            {/* Eyebrow */}
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#B8941F] mb-3">
              Based in ilorin genuine leather,wears and swiss sourced timepieces
            </p>

            {/* Headline */}
            <h1 className="font-serif text-[38px] sm:text-5xl lg:text-[54px] font-light text-black tracking-tight leading-[0.98] mb-4">
              Genuine pieces,<br />
              <span className="italic font-normal text-[#B8941F]">curated from Ilorin.</span>
            </h1>

            {/* Body paragraph */}
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
                className="w-10 h-11 rounded-full bg-black text-white hover:bg-zinc-800 active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Next timepiece"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-stone-500 font-serif ml-1">
                0{currentIndex + 1} / 0{heroItems.length}
              </span>
            </div>

            {/* Trust Proof Badges */}
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

          {/* ================= 2. CENTER: BASE MODEL (WITHOUT WATCH) + DYNAMIC WRIST OVERLAY ================= */}
          <div className="lg:col-span-4 relative flex items-center justify-center w-full min-h-[400px] sm:min-h-[480px] lg:min-h-[580px] order-1 lg:order-2">
            <div className="relative w-full max-w-[440px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-[#EDE6DC] border border-black/5 mx-auto">
              
              {/* 1. Base Model Image (Clean bare wrist, no watch) */}
              <Image
                src="/images/model-bare-wrist.jpg"
                alt="Omo Esho Signatures Model"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 90vw, 40vw"
              />

              {/* Soft studio vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

              {/* 2. Absolute-Positioned Dynamic Overlay Layer on Top of Wrist: top: 65%, left: 51% */}
              <div
                className="absolute z-30 pointer-events-auto"
                style={{
                  top: '65%',
                  left: '51%',
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => activeItem.productRef && setQuickViewProduct(activeItem.productRef)}
                title={`Active watch: ${activeItem.name}`}
              >
                {/* 3. Framer Motion AnimatePresence cross-fading each watch product PNG cutout */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.15, rotate: 8 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.55)] cursor-pointer"
                  >
                    <Image
                      src={activeItem.cutout || activeItem.dialImage || activeItem.image}
                      alt={`${activeItem.name} on wrist`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Subtle pulse beacon indicating interactive timepiece on wrist */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -inset-1 rounded-full bg-[#B8941F] opacity-75 animate-ping pointer-events-none" />
              </div>

              {/* Preserved Floating Bag Image Card in corner */}
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

          {/* ================= 3. RIGHT COLUMN: 6-ITEM THUMBNAIL CAROUSEL WITH DETAILS ================= */}
          <div className="lg:col-span-4 flex flex-col justify-center z-20 order-3">
            {/* Carousel Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#B8941F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B8941F]" />
                <span>Omo Esho Signatures Collection</span>
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                0{currentIndex + 1} / 0{heroItems.length}
              </span>
            </div>

            {/* 6-Item Thumbnail Carousel Stack */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-none">
              {heroItems.map((item, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`group p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-white border-[#B8941F] ring-2 ring-[#B8941F]/30 shadow-md scale-[1.01]'
                        : 'bg-white/60 hover:bg-white border-[#E3DDCF] hover:border-black/20'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-stone-50 border border-stone-200 overflow-hidden shrink-0 p-0.5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    </div>

                    {/* Details: Category, Title, Price in NGN */}
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[#B8941F] truncate">
                          {item.category}
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>On Wrist</span>
                          </span>
                        )}
                      </div>

                      <h4 className={`text-[12px] sm:text-[13px] font-medium leading-tight truncate mt-0.5 ${
                        isActive ? 'text-black font-semibold' : 'text-stone-800'
                      }`}>
                        {item.name}
                      </h4>

                      {/* Price in NGN */}
                      <p className="text-[12px] sm:text-[13px] font-serif font-bold text-black mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quick Select Arrow */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isActive ? 'bg-[#141414] text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200 group-hover:text-black'
                    }`}>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct WhatsApp Order CTA for active watch */}
            <div className="mt-4 pt-3 border-t border-[#DDD6C8]">
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-black hover:bg-zinc-900 active:scale-[0.98] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Order {activeItem.name.split(' ')[0]} on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
