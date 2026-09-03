'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useStore } from '@/context/StoreContext';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

export default function HeroSection() {
  const { products: liveProducts, loading } = useLiveProducts();
  const { formatPrice } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sourced strictly from real live products in database (prioritizing timepieces, up to 6 products)
  const carouselProducts = useMemo(() => {
    if (!liveProducts || liveProducts.length === 0) return [];

    const watches = liveProducts.filter(
      (p) => p.category === 'watches' || p.categoryLabel?.toLowerCase().includes('watch')
    );

    if (watches.length >= 2) {
      return watches.slice(0, 6);
    }

    return liveProducts.slice(0, 6);
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

  const isSignature =
    safeIndex === 0 ||
    Boolean(
      activeProduct?.name.toLowerCase().includes('patek') ||
      activeProduct?.name.toLowerCase().includes('orange')
    );

  return (
    <section
      id="home"
      className="relative min-h-[calc(100svh-64px)] lg:min-h-[calc(100vh-80px)] w-full bg-[#FAF7F2] overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-14 py-6 sm:py-8 select-none"
    >
      {/* Background Subtle Watermark */}
      <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] sm:text-[15vw] font-serif font-light tracking-widest text-[#EADBCE]/40 select-none pointer-events-none z-0 whitespace-nowrap">
        SIGNATURES
      </h1>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center max-w-7xl mx-auto w-full my-auto">
        
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

        {/* Center Column: Fixed Signature Model Photo (Mobile-Scaled & Bottom Grounded) */}
        <div className="lg:col-span-5 relative flex items-end justify-center self-end w-full mt-2 lg:mt-0">
          <div
            className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[520px] aspect-[3/4] mx-auto"
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
              className="object-contain object-bottom select-none pointer-events-none z-10"
            />
          </div>
        </div>

        {/* Right Column: Floating Product Card & Thumbnail Rail from Database */}
        <div
          className="lg:col-span-3 flex flex-col gap-4 sm:gap-5 justify-center w-full mt-2 lg:mt-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Floating Product Card with Cycling Real Database Content */}
          <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-[#B38344] uppercase">
                ✦ {activeProduct?.categoryLabel || 'Swiss Watch'}
              </span>

              {/* Dynamic Badge: "Active on Wrist" for signature piece, "In Stock" for others */}
              {isSignature ? (
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Active on Wrist
                </span>
              ) : (
                <span className="text-[9px] bg-neutral-100 text-neutral-600 font-medium px-2.5 py-0.5 rounded-full border border-neutral-200">
                  {activeProduct?.inStock ? 'In Stock' : 'Exclusive'}
                </span>
              )}
            </div>
            
            {/* Card Content Cross-fade */}
            {loading && totalItems === 0 ? (
              <div className="mt-3 py-10 text-center text-neutral-400 font-serif text-sm animate-pulse">
                Loading atelier pieces...
              </div>
            ) : activeProduct ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-2.5 sm:mt-3 flex flex-col"
                >
                  {/* Real Product Photo from Database */}
                  <div className="relative w-full h-32 sm:h-40 bg-[#FDFBF7] rounded-xl border border-neutral-100 flex items-center justify-center p-2.5 sm:p-3 mb-2.5 sm:mb-3 overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image
                        src={activeProduct.primaryImage}
                        alt={activeProduct.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                      />
                    </div>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                    {activeProduct.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed line-clamp-2">
                    {activeProduct.tagline || activeProduct.description}
                  </p>
                  
                  <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between border-t border-neutral-100 pt-2.5 sm:pt-3">
                    <span className="text-lg sm:text-xl font-bold text-neutral-900">{formattedPrice}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">NGN / Insured</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="mt-3 py-10 text-center text-neutral-400 font-serif text-sm">
                Collection available below
              </div>
            )}

            {/* Direct WhatsApp Order CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-3.5 sm:mt-4 py-2.5 sm:py-3 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              <span>💬</span> Order on WhatsApp
            </a>
          </div>

          {/* Real Products Thumbnail Rail: 6 items in one clean horizontal row on mobile, 3x2 on tablet/desktop */}
          {totalItems > 0 && (
            <div>
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-neutral-500 mb-2">
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
                        src={item.primaryImage}
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
          )}
        </div>

      </div>
    </section>
  );
}
