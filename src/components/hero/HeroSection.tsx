'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useStore } from '@/context/StoreContext';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';
import type { Product } from '@/types/store';

// Exclude multi-panel / collage images from hero rotation so only clean single-product photos render
function isCollageImage(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('patek-philippe-1788295538963') ||
    lower.includes('collage') ||
    lower.includes('grid') ||
    lower.includes('composite') ||
    lower.includes('4-panel') ||
    lower.includes('4_panel') ||
    lower.includes('4in1') ||
    lower.includes('quad')
  );
}

interface HeroSectionProps {
  onSelectCategory?: (cat: any) => void;
}

export default function HeroSection({ onSelectCategory: _onSelectCategory }: HeroSectionProps = {}) {
  const { products: liveProducts, loading } = useLiveProducts();
  const { formatPrice } = useStore();

  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked continuous scale parallax on hero model photo
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const modelScale = shouldReduceMotion ? 1 : rawScale;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sourced strictly from real live products in database (prioritizing wristwatches with clean single photos, up to 6 distinct products)
  const carouselProducts = useMemo<Product[]>(() => {
    if (!liveProducts || liveProducts.length === 0) return [];

    // Filter watches that have clean single photos (no collages)
    const cleanWatches = liveProducts.filter((p) => {
      const isWatch = p.category === 'watches' || p.categoryLabel?.toLowerCase().includes('watch');
      const img = p.primaryImage || (p as any).images?.[0] || '';
      return isWatch && !isCollageImage(img);
    });

    if (cleanWatches.length >= 6) {
      return cleanWatches.slice(0, 6);
    }

    if (cleanWatches.length > 0) {
      // If fewer than 6 clean watches, supplement with other distinct non-collage products from catalogue
      const others = liveProducts.filter(
        (p) =>
          !cleanWatches.some((w) => w.id === p.id) &&
          !isCollageImage(p.primaryImage || (p as any).images?.[0] || '')
      );
      return [...cleanWatches, ...others].slice(0, 6);
    }

    return liveProducts
      .filter((p) => !isCollageImage(p.primaryImage || (p as any).images?.[0] || ''))
      .slice(0, 6);
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

  const getProductImage = (p: Product | null | undefined): string => {
    if (!p) return '';
    return p.primaryImage || (p as any).images?.[0] || '';
  };

  const formattedPrice = activeProduct ? formatPrice(activeProduct.price) : '';
  const whatsappUrl = activeProduct ? getWhatsAppOrderUrl(activeProduct.name, formattedPrice) : '#';
  const activeImage = getProductImage(activeProduct);

  // Renders the product card: ultra-compact on mobile overlay, full-sized on desktop
  const renderProductCard = (isMobileOverlay = false) => {
    if (isMobileOverlay) {
      // Mobile Single-Height Overlaid Card: clean, compact, goes straight to product
      return (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-2.5 border border-white/90 shadow-xl w-full">
          <AnimatePresence mode="wait">
            {loading || !activeProduct ? (
              <motion.div
                key="skeleton-mobile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2.5 animate-pulse"
              >
                <div className="w-14 h-14 bg-neutral-200/70 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="h-3.5 w-3/4 bg-neutral-200/80 rounded" />
                  <div className="h-3 w-1/3 bg-neutral-200/60 rounded" />
                </div>
                <div className="w-16 h-7 bg-neutral-200/70 rounded-lg shrink-0" />
              </motion.div>
            ) : (
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5"
              >
                {/* Product Thumbnail — edge-to-edge object-cover */}
                <div className="relative w-14 h-14 bg-[#F7F4EE] rounded-lg border border-neutral-200 shrink-0 overflow-hidden">
                  {activeImage && (
                    <Image
                      src={activeImage}
                      alt={activeProduct.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                      priority
                    />
                  )}
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
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Desktop Side Column Floating Card: Straight from image to product title, no top tag row
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.08)] p-4 xl:p-5">
        <AnimatePresence mode="wait">
          {loading || !activeProduct ? (
            <motion.div
              key="skeleton-desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="animate-pulse"
            >
              <div className="w-full h-44 xl:h-48 bg-neutral-200/60 rounded-xl mb-3" />
              <div className="h-4 w-2/3 bg-neutral-200/80 rounded mb-2" />
              <div className="h-3 w-1/2 bg-neutral-200/50 rounded mb-4" />
              <div className="w-full h-10 bg-neutral-200/70 rounded-xl" />
            </motion.div>
          ) : (
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Product Image: properly scaled to fill the container with object-cover, no excess inset padding */}
              <div className="relative bg-[#F7F4EE] rounded-xl border border-neutral-200/80 overflow-hidden w-full h-44 xl:h-48 mb-3 shadow-inner">
                {activeImage && (
                  <Image
                    src={activeImage}
                    alt={activeProduct.name}
                    fill
                    sizes="(max-width: 1280px) 280px, 340px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority
                  />
                )}
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

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-3 py-2.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <span>💬</span> Order on WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Renders the 6-thumbnail rail
  const renderThumbnailRail = (isMobile = false) => {
    const currentStr = String(safeIndex + 1).padStart(2, '0');
    const totalStr = String(totalItems).padStart(2, '0');

    return (
      <div className={isMobile ? 'w-full' : ''}>
        <AnimatePresence mode="wait">
          {totalItems <= 0 ? (
            <motion.div
              key="skeleton-rail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="h-3 w-28 bg-neutral-200/60 rounded mb-2 animate-pulse" />
              <div className={isMobile ? 'grid grid-cols-6 gap-1' : 'grid grid-cols-3 gap-2.5'}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="aspect-square rounded-lg sm:rounded-xl bg-neutral-200/40 border border-neutral-200/60 animate-pulse" />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="loaded-rail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-medium text-neutral-500 mb-1 sm:mb-2 px-1">
                <span>Curated Selection ({currentStr}/{totalStr})</span>
                <span className="text-[9px] sm:text-[10px] text-neutral-400">Tap to inspect</span>
              </div>

              <div className={isMobile ? 'grid grid-cols-6 gap-1' : 'grid grid-cols-3 gap-2.5'}>
                {carouselProducts.map((item, idx) => {
                  const itemImg = getProductImage(item);
                  return (
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
                        {itemImg ? (
                          <Image
                            src={itemImg}
                            alt={item.name}
                            fill
                            sizes="60px"
                            className="object-contain"
                          />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[calc(100svh-56px)] lg:min-h-[calc(100vh-100px)] w-full bg-[#FAF7F2] overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-14 pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-5 lg:pb-0 select-none"
    >
      {/* Grand Luxury Typography across top of Hero with subtle atmospheric softness (clearly legible at a glance, fully fitted on mobile) */}
      <div className="absolute top-2 sm:top-4 lg:top-6 inset-x-0 w-full z-10 pointer-events-none select-none flex justify-center items-center overflow-hidden px-2 sm:px-6 lg:px-14">
        <h1 className="[font-family:var(--font-bodoni)] font-bold tracking-tight text-neutral-900/90 uppercase text-[5.5vw] min-[390px]:text-[5.8vw] sm:text-[6.5vw] md:text-[6.8vw] lg:text-[6.8vw] xl:text-[104px] 2xl:text-[118px] leading-none whitespace-nowrap text-center select-none filter blur-[0.4px] transition-all duration-500">
          OMO ESHO SIGNATURES
        </h1>
      </div>

      {/* Main Container: 12-col grid on desktop */}
      <div className="relative z-20 flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 max-w-7xl mx-auto w-full flex-1 min-h-0 items-end">
        
        {/* Left Column: Headline & CTA Buttons — positioned cohesively below the wordmark without large dead space */}
        <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col justify-center h-full w-full shrink-0 z-30 pt-4 lg:pt-14 pb-4 sm:pb-6 lg:pb-10 my-auto">
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

        {/* Center Column: Model Image (In sharp focus with depth shadow in front of subtle soft wordmark) */}
        <div className="order-1 lg:order-2 lg:col-span-5 relative w-full h-full flex flex-col items-center justify-end self-end shrink-0 lg:shrink z-20 pointer-events-none">
          <div className="relative w-full max-w-[440px] sm:max-w-[500px] lg:max-w-[620px] xl:max-w-[700px] 2xl:max-w-[760px] h-[52svh] sm:h-[62svh] lg:h-[84vh] xl:h-[88vh] max-h-[920px] min-h-[340px] mx-auto flex items-end justify-center overflow-hidden">
            {/* Model Photo: Scroll-linked continuous scale parallax zoom */}
            <motion.div
              style={{ scale: modelScale, transformOrigin: 'center bottom' }}
              className="relative w-full h-full drop-shadow-[0_14px_30px_rgba(0,0,0,0.12)] will-change-transform"
            >
              <Image
                src="/images/model-refined.png"
                alt="Omo Esho Model"
                fill
                priority
                className="object-contain object-bottom select-none pointer-events-none z-10"
              />
            </motion.div>

            {/* Mobile Scrim: Soft bottom gradient behind the overlaid product card */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none z-10" />

            {/* Mobile ONLY: Overlaid Product Card Floating on Bottom of Model Photo */}
            <div className="lg:hidden absolute bottom-2 inset-x-2 sm:inset-x-3 z-30 pointer-events-auto">
              {renderProductCard(true)}
            </div>
          </div>

          {/* Mobile ONLY: Compact Thumbnail Rail directly beneath the model */}
          <div className="lg:hidden w-full max-w-[400px] sm:max-w-[460px] mx-auto shrink-0 pt-2 pointer-events-auto z-30">
            {renderThumbnailRail(true)}
          </div>
        </div>

        {/* Right Column: Floating Card + Thumbnail Rail (Aligned to bottom) */}
        <div
          className="hidden lg:flex lg:order-3 lg:col-span-3 flex-col gap-3 xl:gap-4 justify-end pb-4 lg:pb-8 w-full z-30"
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

