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
 * - If product has multiple images and the first is a multi-angle/collage thumbnail, extracts an individual angle photo.
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

// Hallmark atelier timepieces ensuring the floating card ALWAYS has crisp, high-res assets & zero blank states
const FALLBACK_WATCHES: HeroCuratedProduct[] = [
  {
    id: 'hero-watch-1',
    name: 'Patek Philippe Aquanaut Chrono',
    slug: 'patek-philippe-aquanaut',
    price: 240000,
    category: 'watches',
    categoryLabel: 'Swiss Timepiece',
    tagline: 'Automatic caliber with embossed dial',
    description: 'Swiss precision movement with sapphire glass and vulcanized rubber strap.',
    heroImage: '/images/watches/watch-1.png',
    primaryImage: '/images/watches/watch-1.png',
    secondaryImage: '',
    rating: 5,
    reviewCount: 12,
    inStock: true,
    colors: [],
    materials: [],
    specs: [],
  },
  {
    id: 'hero-watch-2',
    name: 'Patek Philippe Tourbillon Skeleton',
    slug: 'patek-philippe-tourbillon',
    price: 380000,
    category: 'watches',
    categoryLabel: 'Swiss Timepiece',
    tagline: 'Rose gold casing & openwork movement',
    description: 'Masterpiece skeleton dial showcasing twin-barrel mechanical escapement.',
    heroImage: '/images/watches/watch-2.png',
    primaryImage: '/images/watches/watch-2.png',
    secondaryImage: '',
    rating: 5,
    reviewCount: 9,
    inStock: true,
    colors: [],
    materials: [],
    specs: [],
  },
  {
    id: 'hero-watch-3',
    name: 'Cosmograph Daytona Rose Gold',
    slug: 'cosmograph-daytona',
    price: 320000,
    category: 'watches',
    categoryLabel: 'Swiss Timepiece',
    tagline: 'Triple register racing chronograph',
    description: 'Oysterflex strap with solid 18k rose gold bezel and tachymeter scale.',
    heroImage: '/images/watches/watch-3.png',
    primaryImage: '/images/watches/watch-3.png',
    secondaryImage: '',
    rating: 5,
    reviewCount: 15,
    inStock: true,
    colors: [],
    materials: [],
    specs: [],
  },
  {
    id: 'hero-watch-4',
    name: 'Royal Oak Offshore Diver',
    slug: 'royal-oak-offshore',
    price: 295000,
    category: 'watches',
    categoryLabel: 'Swiss Timepiece',
    tagline: 'Octagonal brushed steel case',
    description: 'Méga Tapisserie textured dial with internal rotating diver bezel.',
    heroImage: '/images/watches/watch-4.png',
    primaryImage: '/images/watches/watch-4.png',
    secondaryImage: '',
    rating: 5,
    reviewCount: 8,
    inStock: true,
    colors: [],
    materials: [],
    specs: [],
  },
  {
    id: 'hero-watch-5',
    name: 'Submariner Date Green Ceramic',
    slug: 'submariner-date-green',
    price: 265000,
    category: 'watches',
    categoryLabel: 'Swiss Timepiece',
    tagline: 'Cerachrom bezel with Glidelock clasp',
    description: 'Professional oystersteel dive watch with signature green sunburst dial.',
    heroImage: '/images/watches/watch-5.png',
    primaryImage: '/images/watches/watch-5.png',
    secondaryImage: '',
    rating: 5,
    reviewCount: 19,
    inStock: true,
    colors: [],
    materials: [],
    specs: [],
  },
  {
    id: 'hero-watch-6',
    name: 'Grand Complications Perpetual',
    slug: 'grand-complications',
    price: 410000,
    category: 'watches',
    categoryLabel: 'Swiss Timepiece',
    tagline: 'Moonphase indicator & calendar caliber',
    description: 'Alligator leather strap with fluted lugs and annual astronomical tracking.',
    heroImage: '/images/watches/watch-6.png',
    primaryImage: '/images/watches/watch-6.png',
    secondaryImage: '',
    rating: 5,
    reviewCount: 11,
    inStock: true,
    colors: [],
    materials: [],
    specs: [],
  },
];

interface HeroSectionProps {
  onSelectCategory?: (cat: any) => void;
}

export default function HeroSection({ onSelectCategory: _onSelectCategory }: HeroSectionProps = {}) {
  const { products: liveProducts } = useLiveProducts();
  const { formatPrice } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter products: Map live products if available; fallback to hallmark atelier timepieces so card is never blank
  const carouselProducts = useMemo<HeroCuratedProduct[]>(() => {
    if (!liveProducts || liveProducts.length === 0) return FALLBACK_WATCHES;

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

    if (verifiedProducts.length >= 2) {
      return verifiedProducts.slice(0, 6);
    }

    return FALLBACK_WATCHES;
  }, [liveProducts]);

  const totalItems = carouselProducts.length;
  const safeIndex = totalItems > 0 ? currentIndex % totalItems : 0;
  const activeProduct = totalItems > 0 ? carouselProducts[safeIndex] : FALLBACK_WATCHES[0];

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

  const formattedPrice = formatPrice(activeProduct.price);
  const whatsappUrl = getWhatsAppOrderUrl(activeProduct.name, formattedPrice);

  // Renders the product card: ultra-compact on mobile overlay, full-sized on desktop
  const renderProductCard = (isMobileOverlay = false) => {
    if (isMobileOverlay) {
      // Mobile Single-Height Overlaid Card: ultra-compact (~85px), crisp text contrast
      return (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-2.5 border border-white/90 shadow-xl w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold tracking-widest text-[#B38344] uppercase">
              ✦ {activeProduct.categoryLabel || 'Swiss Watch'}
            </span>
            <span className="text-[8px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
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
              <div className="relative w-12 h-12 bg-[#F7F4EE] rounded-lg border border-neutral-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <Image
                  src={activeProduct.heroImage}
                  alt={activeProduct.name}
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Title & Price */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xs font-bold text-neutral-950 leading-tight truncate">
                  {activeProduct.name}
                </h3>
                <div className="text-xs font-bold text-neutral-950 font-serif mt-0.5">
                  {formattedPrice}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2.5 bg-black hover:bg-neutral-800 text-white text-[10px] font-semibold rounded-lg shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span>💬</span>
                <span>Order</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    // Desktop Side Column Floating Card: High contrast, prominent image & clear typography
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.08)] p-4 xl:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#B38344] uppercase">
            ✦ {activeProduct.categoryLabel || 'Swiss Watch'}
          </span>

          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
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
            {/* Product Thumbnail with contrast-enhancing background */}
            <div className="relative bg-[#F7F4EE] rounded-xl border border-neutral-200/80 flex items-center justify-center p-2.5 overflow-hidden w-full h-32 xl:h-36 mb-2.5">
              <div className="relative w-full h-full">
                <Image
                  src={activeProduct.heroImage}
                  alt={activeProduct.name}
                  fill
                  sizes="300px"
                  className="object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                  priority
                />
              </div>
            </div>

            {/* Title, Tagline & Price */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-base lg:text-lg font-bold text-neutral-950 leading-snug truncate">
                {activeProduct.name}
              </h3>
              <p className="text-xs text-neutral-600 line-clamp-1 mt-0.5">
                {activeProduct.tagline || activeProduct.description}
              </p>
              <div className="text-lg font-bold text-neutral-950 mt-1.5 font-serif">
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
      className="relative min-h-[calc(100svh-56px)] lg:min-h-[calc(100vh-100px)] w-full bg-[#FAF7F2] overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-14 pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-5 lg:pb-0 select-none"
    >
      {/* Large Bold Luxury Decorative Background Wordmark (Contained within hero, behind model photo) */}
      <div className="absolute top-4 sm:top-8 lg:top-12 inset-x-0 w-full pointer-events-none z-0 select-none flex justify-center items-center overflow-hidden">
        <span className="font-serif font-black tracking-tighter text-[13vw] xl:text-[145px] uppercase text-neutral-900/[0.07] leading-none whitespace-nowrap">
          OMO ESHO SIGNATURES
        </span>
      </div>

      {/* Main Container: 12-col grid on desktop, aligned to bottom */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 max-w-7xl mx-auto w-full flex-1 min-h-0 justify-between items-end">
        
        {/* Left Column: Headline & CTA Buttons aligned to bottom */}
        <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col justify-end h-full w-full shrink-0 z-10 pb-4 sm:pb-6 lg:pb-8">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 sm:gap-4 lg:gap-5 w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif text-neutral-950 font-normal leading-[1.12]">
              Genuine pieces, <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#B38344]">curated from Ilorin.</span>
            </h2>

            <div className="flex items-center justify-center lg:justify-start gap-3 w-full max-w-[320px] sm:max-w-none pt-1">
              <a
                href="#catalogue"
                className="flex-1 sm:flex-none text-center px-6 sm:px-7 py-3 sm:py-3.5 bg-black text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition shadow-sm inline-block cursor-pointer"
              >
                Explore Collections &rarr;
              </a>
              <a
                href="#lookbook"
                className="flex-1 sm:flex-none text-center px-6 sm:px-7 py-3 sm:py-3.5 border border-neutral-300 text-neutral-800 text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white transition inline-block cursor-pointer"
              >
                Lookbook
              </a>
            </div>
          </div>
        </div>

        {/* Center Column: Model Image (Generously sized & grounded to bottom edge) */}
        <div className="order-1 lg:order-2 lg:col-span-5 relative w-full h-full flex flex-col items-center justify-end self-end shrink-0 lg:shrink z-10 pointer-events-none">
          <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[560px] xl:max-w-[620px] h-[52svh] sm:h-[60svh] lg:h-[76vh] xl:h-[82vh] max-h-[820px] min-h-[340px] mx-auto flex items-end justify-center">
            {/* Model Photo */}
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
          className="hidden lg:flex lg:order-3 lg:col-span-3 flex-col gap-3 xl:gap-4 justify-end pb-4 lg:pb-8 w-full z-10"
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
