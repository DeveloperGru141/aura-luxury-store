'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useStore } from '@/context/StoreContext';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';
import type { Product, ProductCategory } from '@/types/store';

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
  const images: string[] = (product as { images?: string[] }).images || [];
  
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

interface HeroSectionProps {
  onSelectCategory?: (cat: ProductCategory) => void;
}

export default function HeroSection({ onSelectCategory }: HeroSectionProps = {}) {
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

  const navLinks: { label: string; href: string; category?: ProductCategory }[] = [
    { label: 'Shop', href: '#catalogue', category: 'all' },
    { label: 'Shoes', href: '#catalogue', category: 'shoes' },
    { label: 'Timepieces', href: '#catalogue', category: 'watches' },
    { label: 'Bags', href: '#catalogue', category: 'bags' },
    { label: 'Wears', href: '#catalogue', category: 'apparel' },
    { label: 'Lookbook', href: '#lookbook' },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[number]
  ) => {
    if (link.category && onSelectCategory) {
      e.preventDefault();
      onSelectCategory(link.category);
      const el = document.getElementById('catalogue');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', link.href);
      return;
    }
    if (link.href.startsWith('#')) {
      e.preventDefault();
      const id = link.href.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', link.href);
    }
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
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.08)] p-4 xl:p-5">
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
            <div className="relative bg-[#FDFBF7] rounded-xl border border-neutral-100 flex items-center justify-center p-2 overflow-hidden w-full h-28 xl:h-36 mb-2 xl:mb-3">
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

  // Renders the thumbnail rail
  const renderThumbnailRail = (isMobile = false) => {
    if (totalItems <= 0) return null;

    return (
      <div className={isMobile ? 'w-full' : ''}>
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-medium text-neutral-500 mb-1.5 px-1">
          <span className="tracking-wider uppercase">Curated (0{safeIndex + 1}/0{totalItems})</span>
          <span className="text-[9px] text-neutral-400">Select piece</span>
        </div>

        <div className={isMobile ? 'grid grid-cols-6 gap-1' : 'grid grid-cols-3 gap-2'}>
          {carouselProducts.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleSelect(idx)}
              className={`relative aspect-square rounded-lg sm:rounded-xl overflow-hidden p-1 sm:p-1.5 flex items-center justify-center transition-all duration-200 cursor-pointer ${
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
      className="relative min-h-[calc(100svh-56px)] lg:min-h-[calc(100vh-80px)] w-full bg-[#FAF7F2] overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-14 pt-3 sm:pt-4 lg:pt-6 pb-3 sm:pb-5 lg:pb-0 select-none"
    >
      {/* Luxury Brand Editorial Title Across Top Behind Model */}
      <div className="absolute top-3 sm:top-4 lg:top-6 inset-x-0 w-full px-4 sm:px-8 lg:px-14 pointer-events-none z-0 select-none">
        <div className="max-w-7xl mx-auto flex items-baseline justify-between w-full">
          <span className="font-serif font-bold text-[clamp(1.2rem,3.8vw,3.6rem)] sm:text-[clamp(1.75rem,4.2vw,4.4rem)] xl:text-[4.75rem] tracking-[0.14em] sm:tracking-[0.16em] uppercase text-neutral-900 leading-none whitespace-nowrap">
            OMO ESHO
          </span>
          <span className="font-serif font-bold text-[clamp(1.2rem,3.8vw,3.6rem)] sm:text-[clamp(1.75rem,4.2vw,4.4rem)] xl:text-[4.75rem] tracking-[0.14em] sm:tracking-[0.16em] uppercase text-neutral-900 leading-none text-right whitespace-nowrap">
            SIGNATURES
          </span>
        </div>
      </div>

      {/* Main Container: 12-col grid on desktop */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 max-w-7xl mx-auto w-full flex-1 min-h-0 pt-8 sm:pt-10 lg:pt-24 xl:pt-28 justify-between">
        
        {/* Left Column: Nav bar under OMO ESHO, Headline & CTAs aligned to bottom */}
        <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col justify-between h-full w-full shrink-0 z-10 pb-4 sm:pb-6">
          {/* Category Navigation Bar (in the exact manner of reference layout) */}
          <div className="hidden lg:block w-full">
            <div className="border-y border-neutral-300/80 py-2 sm:py-2.5">
              <nav className="flex items-center justify-between xl:justify-start gap-3 xl:gap-5 text-[10px] xl:text-[11px] tracking-[0.14em] uppercase font-medium text-neutral-700 overflow-x-auto scrollbar-none">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="hover:text-black transition-colors whitespace-nowrap py-0.5 cursor-pointer shrink-0"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Flexible middle breathing space */}
          <div className="hidden lg:block flex-1 min-h-[40px] lg:min-h-[80px]" />

          {/* Bottom-Aligned Editorial Headline & CTA Buttons */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 sm:gap-4 lg:gap-6 w-full shrink-0 pt-2 lg:pt-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif text-neutral-900 leading-[1.12]">
              Genuine pieces, <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#B38344]">curated from Ilorin.</span>
            </h2>

            <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 w-full max-w-[320px] sm:max-w-none pt-1">
              <a
                href="#catalogue"
                className="flex-1 sm:flex-none text-center px-5 sm:px-7 py-3 sm:py-3.5 bg-black text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition shadow-sm inline-block"
              >
                Explore Collections &rarr;
              </a>
              <a
                href="#lookbook"
                className="flex-1 sm:flex-none text-center px-5 sm:px-7 py-3 sm:py-3.5 border border-neutral-300 text-neutral-800 text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white transition inline-block"
              >
                Lookbook
              </a>
            </div>
          </div>
        </div>

        {/* Center Column: Model Image (Scaled bigger and taller like reference, head reaching into brand text area) */}
        <div className="order-1 lg:order-2 lg:col-span-5 relative w-full h-full flex flex-col items-center justify-end self-end shrink-0 lg:shrink z-10 pointer-events-none">
          <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[560px] xl:max-w-[640px] h-[52svh] sm:h-[58svh] lg:h-[78vh] xl:h-[84vh] max-h-[860px] min-h-[340px] mx-auto flex items-end justify-center">
            {/* Model Photo: Crisp, tall, solid trousers anchored cleanly at bottom */}
            <div className="relative w-full h-full">
              <Image
                src="/images/model-refined.png"
                alt="Omo Esho Model"
                fill
                priority
                className="object-contain object-bottom scale-105 sm:scale-105 lg:scale-110 xl:scale-115 origin-bottom select-none pointer-events-none z-10"
              />
            </div>

            {/* Mobile Scrim: Soft bottom gradient behind the overlaid product card */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none z-10" />

            {/* Mobile ONLY: Overlaid Product Card Floating on Bottom of Model Photo */}
            <div className="lg:hidden absolute bottom-2 inset-x-2 sm:inset-x-3 z-20 pointer-events-auto">
              {renderProductCard(true)}
            </div>
          </div>

          {/* Mobile ONLY: Compact Thumbnail Rail directly beneath the model */}
          <div className="lg:hidden w-full max-w-[400px] sm:max-w-[460px] mx-auto shrink-0 pt-2 pointer-events-auto">
            {renderThumbnailRail(true)}
          </div>
        </div>

        {/* Right Column: Floating Card + Thumbnail Rail (Aligned to bottom) */}
        <div
          className="hidden lg:flex lg:order-3 lg:col-span-3 flex-col gap-3 xl:gap-4 justify-end pb-4 lg:pb-6 w-full z-10"
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
