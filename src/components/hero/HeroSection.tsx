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

  // Renders the floating product card (responsive for mobile overlay and desktop side column)
  const renderProductCard = (isMobileOverlay = false) => {
    if (loading && totalItems === 0) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-8 text-center text-neutral-400 font-serif text-sm animate-pulse">
          Loading atelier pieces...
        </div>
      );
    }

    if (!activeProduct) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-8 text-center text-neutral-400 font-serif text-sm">
          Curated collection below
        </div>
      );
    }

    return (
      <div
        className={`bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.08)] ${
          isMobileOverlay ? 'p-3 sm:p-4' : 'p-5'
        }`}
      >
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
            className={isMobileOverlay ? 'flex items-center gap-3' : 'flex flex-col'}
          >
            {/* Product Thumbnail */}
            <div
              className={`relative bg-[#FDFBF7] rounded-xl border border-neutral-100 flex items-center justify-center p-2 overflow-hidden shrink-0 ${
                isMobileOverlay ? 'w-20 h-20' : 'w-full h-36 mb-3'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={activeProduct.heroImage}
                  alt={activeProduct.name}
                  fill
                  sizes="(max-width: 768px) 100px, 300px"
                  className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                />
              </div>
            </div>

            {/* Text & Price */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-neutral-900 leading-snug truncate">
                {activeProduct.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-500 line-clamp-1 mt-0.5">
                {activeProduct.tagline || activeProduct.description}
              </p>
              <div className="text-base sm:text-lg font-bold text-neutral-900 mt-1 font-serif">
                {formattedPrice}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Direct WhatsApp Order CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2.5 sm:mt-3 py-2 sm:py-2.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-[11px] sm:text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
        >
          <span>💬</span> Order on WhatsApp
        </a>
      </div>
    );
  };

  // Renders the 6-thumbnail rail
  const renderThumbnailRail = () => {
    if (totalItems <= 0) return null;

    return (
      <div>
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-neutral-500 mb-2 px-1">
          <span>Curated Selection (0{safeIndex + 1}/0{totalItems})</span>
          <span className="text-[10px] text-neutral-400">Tap to inspect</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-3 gap-1.5 sm:gap-2.5">
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
                  sizes="80px"
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
      className="relative min-h-[calc(100svh-64px)] lg:min-h-[calc(100vh-80px)] w-full bg-[#FAF7F2] overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-14 py-6 sm:py-8 select-none"
    >
      {/* Background Subtle Watermark — Hidden on mobile to prevent clashing with portrait photo */}
      <h1 className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-light tracking-widest text-[#EADBCE]/40 select-none pointer-events-none z-0 whitespace-nowrap">
        SIGNATURES
      </h1>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-7xl mx-auto w-full my-auto">
        
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-4 flex flex-col items-start gap-4 sm:gap-6 text-left">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#A67C43] font-semibold">
            Based in Ilorin • Genuine Leather, Wears and Swiss Sourced Timepieces
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-neutral-900 leading-[1.12]">
            Genuine pieces, <br />
            <span className="italic font-normal text-[#B38344]">curated from Ilorin.</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm">
            Every piece we carry is genuine leather bags, wears, and wristwatches sourced directly from various makers. Every order is inspected before insured worldwide delivery.
          </p>
          
          <div className="flex items-center gap-3 pt-1 w-full sm:w-auto">
            <a
              href="#catalogue"
              className="flex-1 sm:flex-none text-center px-5 sm:px-7 py-3 sm:py-3.5 bg-black text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition shadow-sm inline-block"
            >
              Explore Collections &rarr;
            </a>
            <a
              href="#lookbook"
              className="flex-1 sm:flex-none text-center px-5 sm:px-7 py-3 sm:py-3.5 border border-neutral-300 text-neutral-800 text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white transition inline-block"
            >
              Lookbook
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-[11px] font-medium tracking-wider text-neutral-700 uppercase pt-1">
            <span>&bull; 100% Genuine</span>
            <span>&bull; Worldwide Insured Delivery</span>
          </div>
        </div>

        {/* Center Column: Model Stage with Bottom-Overlaid Card on Mobile */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-end self-end w-full mt-2 lg:mt-0">
          {/* Constrained Height Container on Mobile (Max 480px) */}
          <div className="relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[520px] h-[440px] sm:h-[500px] lg:h-auto lg:aspect-[3/4] mx-auto rounded-2xl lg:rounded-none overflow-hidden lg:overflow-visible">
            {/* Model Photo with Soft Fade Mask */}
            <div
              className="relative w-full h-full"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
              }}
            >
              <Image
                src="/images/model-refined.png"
                alt="Omo Esho Model"
                fill
                priority
                className="object-contain object-bottom select-none pointer-events-none z-10"
              />
            </div>

            {/* Mobile Scrim: Soft bottom gradient behind the overlaid product card */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none z-10" />

            {/* Mobile ONLY: Overlaid Product Card Floating on Bottom of Image */}
            <div className="lg:hidden absolute bottom-2.5 inset-x-2.5 z-20">
              {renderProductCard(true)}
            </div>
          </div>

          {/* Mobile ONLY: Thumbnail Rail directly beneath the contained model visual */}
          <div className="lg:hidden w-full max-w-[360px] sm:max-w-[440px] mx-auto mt-3">
            {renderThumbnailRail()}
          </div>
        </div>

        {/* Desktop ONLY: Right Column (Floating Card + Thumbnail Rail) */}
        <div
          className="hidden lg:flex lg:col-span-3 flex-col gap-5 justify-center w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {renderProductCard(false)}
          {renderThumbnailRail()}
        </div>

      </div>
    </section>
  );
}
