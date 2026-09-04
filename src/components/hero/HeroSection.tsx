'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useStore } from '@/context/StoreContext';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';
import type { Product } from '@/types/store';

// Helper to detect multi-panel collage / thumbnail grid images
function isCollageImage(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('collage') ||
    lower.includes('grid') ||
    lower.includes('multi') ||
    lower.includes('composite') ||
    lower.includes('4-panel') ||
    lower.includes('4_panel') ||
    lower.includes('4in1') ||
    lower.includes('4-in-1') ||
    lower.includes('quad') ||
    lower.includes('angles') ||
    lower.includes('thumbnail_composite') ||
    lower.includes('catalog_thumb')
  );
}

/**
 * Extracts a single clean, isolated product photo for hero curation.
 * - If product has multiple images and the first is a multi-angle/collage thumbnail, extracts an individual angle photo (e.g. index 1+).
 * - If a product ONLY has a collage version available, returns null so it is excluded from hero rotation.
 */
function getCleanHeroImage(product: Product): string | null {
  const images: string[] = (product as any).images || [];
  
  if (images.length === 0) {
    const fallback = product.primaryImage;
    if (!fallback || isCollageImage(fallback)) return null;
    return fallback;
  }

  // If multiple images are available, search for a clean non-collage individual shot
  if (images.length > 1) {
    const cleanSubsequent = images.slice(1).find((img) => !isCollageImage(img));
    if (cleanSubsequent) return cleanSubsequent;

    if (!isCollageImage(images[0])) return images[0];

    return null;
  }

  // Exactly 1 image: ensure it's not a multi-panel collage
  const single = images[0] || product.primaryImage;
  if (!single || isCollageImage(single)) return null;
  return single;
}

type HeroCuratedProduct = Product & { heroImage: string };

export default function HeroSection() {
  const { products: liveProducts, loading } = useLiveProducts();
  const { formatPrice } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter products: Enforce photo-quality gate (must have clean single isolated photo, no collages)
  const carouselProducts = useMemo<HeroCuratedProduct[]>(() => {
    if (!liveProducts || liveProducts.length === 0) return [];

    const verifiedProducts: HeroCuratedProduct[] = [];
    for (const prod of liveProducts) {
      const cleanImg = getCleanHeroImage(prod);
      if (cleanImg) {
        verifiedProducts.push({
          ...prod,
          heroImage: cleanImg,
        });
      }
    }

    const watches = verifiedProducts.filter(
      (p) => p.category === 'watches' || p.categoryLabel?.toLowerCase().includes('watch')
    );

    if (watches.length >= 2) {
      return watches.slice(0, 6);
    }

    return verifiedProducts.slice(0, 6);
  }, [liveProducts]);

  const totalItems = carouselProducts.length;
  const safeIndex = totalItems > 0 ? currentIndex % totalItems : 0;
  const activeProduct = totalItems > 0 ? carouselProducts[safeIndex] : null;

  // Auto-advance timer: cycles card selection (~4.5s), pauses on hover/interaction
  useEffect(() => {
    if (isPaused || totalItems <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalItems]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSelect = (index: number) => {
    resetTimer();
    setCurrentIndex(index);
  };

  const formattedPrice = activeProduct ? formatPrice(activeProduct.price) : '₦240,000';
  const whatsappUrl = activeProduct
    ? getWhatsAppOrderUrl(activeProduct.name, formattedPrice)
    : '#';

  // Renders the product card: ultra-compact on mobile overlay, full-sized on desktop
  const renderProductCard = (isMobileOverlay = false) => {
    if (loading && totalItems === 0) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-neutral-200/80 shadow-md text-center text-neutral-400 font-serif text-xs animate-pulse">
          Loading atelier pieces...
        </div>
      );
    }

    if (!activeProduct) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-neutral-200/80 shadow-md text-center text-neutral-400 font-serif text-xs">
          Curated collection below
        </div>
      );
    }

    if (isMobileOverlay) {
      // Mobile Single-Height Overlaid Card: ultra-compact (~85px)
      return (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-2.5 border border-white/80 shadow-xl w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold tracking-widest text-[#B38344] uppercase">
              ✦ {activeProduct.categoryLabel || 'Swiss Watch'}
            </span>
            <span className="text-[8px] bg-neutral-100 text-neutral-600 font-medium px-2 py-0.2 rounded-full">
              {activeProduct.inStock ? 'In Stock' : 'Exclusive'}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5"
            >
              {/* Small Product Thumbnail */}
              <div className="relative w-12 h-12 bg-[#FDFBF7] rounded-lg border border-neutral-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <Image
                  src={activeProduct.heroImage}
                  alt={activeProduct.name}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>

              {/* Title & Price */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xs font-bold text-neutral-900 leading-tight truncate">
                  {activeProduct.name}
                </h3>
                <div className="text-xs font-bold text-neutral-900 font-serif mt-0.5">
                  {formattedPrice}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2.5 bg-black hover:bg-neutral-800 text-white text-[10px] font-semibold rounded-lg shrink-0 flex items-center gap-1 shadow-sm"
              >
                <span>💬</span>
                <span>Order</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    // Desktop Side Column Floating Card
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.08)] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#B38344] uppercase">
            ✦ {activeProduct.categoryLabel || 'Swiss Watch'}
          </span>

          <span className="text-[9px] bg-neutral-100 text-neutral-600 font-medium px-2.5 py-0.5 rounded-full border border-neutral-200">
            {activeProduct.inStock ? 'In Stock' : 'Exclusive'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            {/* Product Thumbnail */}
            <div className="relative bg-[#FDFBF7] rounded-xl border border-neutral-100 flex items-center justify-center p-2 overflow-hidden w-full h-36 mb-3">
              <div className="relative w-full h-full">
                <Image
                  src={activeProduct.heroImage}
                  alt={activeProduct.name}
                  fill
                  sizes="300px"
                  className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                />
              </div>
            </div>

            {/* Text & Price */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-base lg:text-lg font-bold text-neutral-900 leading-snug truncate">
                {activeProduct.name}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                {activeProduct.tagline || activeProduct.description}
              </p>
              <div className="text-lg font-bold text-neutral-900 mt-1 font-serif">
                {formattedPrice}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 py-2.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
        >
          <span>💬</span> Order on WhatsApp
        </a>
      </div>
    );
  };

  // Renders the 6-thumbnail rail
  const renderThumbnailRail = (isMobile = false) => {
    if (totalItems <= 0) return null;

    return (
      <div className={isMobile ? 'w-full' : ''}>
        <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-medium text-neutral-500 mb-1 sm:mb-2 px-1">
          <span>Curated Selection (0{safeIndex + 1}/0{totalItems})</span>
          <span className="text-[9px] sm:text-[10px] text-neutral-400">Tap to inspect</span>
        </div>

        <div className={isMobile ? 'grid grid-cols-6 gap-1' : 'grid grid-cols-3 gap-2.5'}>
          {carouselProducts.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleSelect(idx)}
              className={`relative aspect-square rounded-lg sm:rounded-xl overflow-hidden p-1 sm:p-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                safeIndex === idx
                  ? 'bg-[#FDFBF7] border-2 border-[#B38344] shadow-sm scale-105 ring-2 ring-[#B38344]/15'
                  : 'bg-[#FDFBF7] border border-neutral-200/80 hover:border-neutral-300 opacity-70 hover:opacity-100'
              }`}
              aria-label={`Select ${item.name}`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={item.heroImage}
                  alt={item.name}
                  fill
                  sizes="60px"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100svh-56px)] lg:h-auto lg:min-h-[calc(100vh-80px)] w-full bg-[#FAF7F2] overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-14 py-2.5 sm:py-6 lg:py-8 select-none"
    >
      {/* Background Subtle Watermark */}
      <h1 className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-serif font-light tracking-[0.16em] text-[#EADBCE]/40 select-none pointer-events-none z-0 whitespace-nowrap">
        SIGNATURES
      </h1>

      {/* Main Container: On mobile, visual stage is top (order-1), headline & CTAs under model (order-2); on desktop, 12-col grid */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-8 items-center max-w-7xl mx-auto w-full h-full my-auto justify-between lg:justify-center">
        
        {/* Visual Stage: Model + Wristwatch Transition (order-1 on mobile, order-2 on desktop) */}
        <div className="order-1 lg:order-2 lg:col-span-5 relative w-full flex flex-col items-center justify-end self-center my-1 lg:my-0 shrink-0 lg:shrink">
          <div className="relative w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[520px] h-[48svh] sm:h-[52svh] max-h-[480px] min-h-[320px] lg:h-auto lg:aspect-[3/4] mx-auto rounded-2xl lg:rounded-none overflow-hidden lg:overflow-visible flex items-end justify-center">
            {/* Model Photo with Soft Fade Mask */}
            <div
              className="relative w-full h-full"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
              }}
            >
              <Image
                src="/images/model-refined.png"
                alt="Omo Esho Model"
                fill
                priority
                className="object-contain object-bottom scale-105 sm:scale-100 origin-bottom select-none pointer-events-none z-10"
              />
            </div>

            {/* Mobile Scrim: Soft bottom gradient behind the overlaid product card */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 via-black/15 to-transparent pointer-events-none z-10" />

            {/* Mobile ONLY: Overlaid Product Card Floating on Bottom of Model Photo */}
            <div className="lg:hidden absolute bottom-2 inset-x-2 sm:inset-x-3 z-20">
              {renderProductCard(true)}
            </div>
          </div>

          {/* Mobile ONLY: Compact Thumbnail Rail directly beneath the model */}
          <div className="lg:hidden w-full max-w-[400px] sm:max-w-[460px] mx-auto shrink-0 pt-2">
            {renderThumbnailRail(true)}
          </div>
        </div>

        {/* Editorial Headline & CTA Actions: Under the model on mobile (order-2), left column on desktop (order-1) */}
        <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left gap-1.5 sm:gap-3 lg:gap-6 w-full shrink-0 pt-1 lg:pt-0">
          <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-[#A67C43] font-semibold">
            Based in Ilorin • Genuine Leather & Sourced Timepieces
          </p>
          <h2 className="text-xl sm:text-3xl lg:text-6xl font-serif text-neutral-900 leading-[1.12]">
            Genuine pieces, <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#B38344]">curated from Ilorin.</span>
          </h2>
          <p className="hidden sm:block text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm">
            Every piece we carry is genuine leather bags, wears, and wristwatches sourced directly from various makers. Inspected before insured delivery.
          </p>
          
          <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-0.5 sm:pt-1 w-full max-w-[320px] sm:max-w-none">
            <a
              href="#catalogue"
              className="flex-1 sm:flex-none text-center px-4 sm:px-7 py-2 sm:py-3.5 bg-black text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition shadow-sm inline-block"
            >
              Explore Collections &rarr;
            </a>
            <a
              href="#lookbook"
              className="flex-1 sm:flex-none text-center px-4 sm:px-7 py-2 sm:py-3.5 border border-neutral-300 text-neutral-800 text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white transition inline-block"
            >
              Lookbook
            </a>
          </div>

          <div className="hidden lg:flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium tracking-wider text-neutral-700 uppercase pt-1">
            <span>&bull; 100% Genuine</span>
            <span>&bull; Worldwide Insured Delivery</span>
          </div>
        </div>

        {/* Desktop ONLY: Right Column (Floating Card + Thumbnail Rail) */}
        <div
          className="hidden lg:flex lg:order-3 lg:col-span-3 flex-col gap-5 justify-center w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {renderProductCard(false)}
          {renderThumbnailRail(false)}
        </div>

      </div>
    </section>
  );
}
