'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

interface Timepiece {
  id: number;
  name: string;
  tagline: string;
  price: string;
  thumbImg: string;
  isSignature: boolean;
}

const timepieces: Timepiece[] = [
  {
    id: 1,
    name: 'Patek Philippe Aquanaut Orange',
    tagline: 'Swiss precision movement & composite strap',
    price: '₦240,000',
    thumbImg: '/images/watches/watch-1.png',
    isSignature: true,
  },
  {
    id: 2,
    name: 'Patek Philippe Tourbillon Skeleton',
    tagline: 'Rose gold bezel & openworked calibre',
    price: '₦380,000',
    thumbImg: '/images/watches/watch-2.png',
    isSignature: false,
  },
  {
    id: 3,
    name: 'Patek Philippe AET Remould',
    tagline: 'Tiffany turquoise ceramic edition',
    price: '₦310,000',
    thumbImg: '/images/watches/watch-3.png',
    isSignature: false,
  },
  {
    id: 4,
    name: 'Patek Philippe Aquanaut Chrono',
    tagline: 'Black embossed dial & composite strap',
    price: '₦260,000',
    thumbImg: '/images/watches/watch-4.png',
    isSignature: false,
  },
  {
    id: 5,
    name: 'Exhibition Calibre Movement',
    tagline: '22k Gold rotor Swiss caseback',
    price: '₦290,000',
    thumbImg: '/images/watches/watch-5.png',
    isSignature: false,
  },
  {
    id: 6,
    name: 'Poedagar Classic Date',
    tagline: 'Emerald leather & silver sunray dial',
    price: '₦120,000',
    thumbImg: '/images/watches/watch-6.png',
    isSignature: false,
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeWatch = timepieces[currentIndex];
  const whatsappUrl = getWhatsAppOrderUrl(activeWatch.name, activeWatch.price);

  // Auto-advance timer: cycles card selection (~4.5s), pauses on hover/interaction
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % timepieces.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNext = () => {
    resetTimer();
    setCurrentIndex((prev) => (prev + 1) % timepieces.length);
  };

  const handlePrev = () => {
    resetTimer();
    setCurrentIndex((prev) => (prev - 1 + timepieces.length) % timepieces.length);
  };

  const handleSelect = (index: number) => {
    resetTimer();
    setCurrentIndex(index);
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-80px)] w-full bg-[#FAF7F2] overflow-hidden flex flex-col justify-between px-6 lg:px-14 py-8 select-none"
    >
      {/* Background Subtle Watermark */}
      <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-light tracking-widest text-[#EADBCE]/40 select-none pointer-events-none z-0 whitespace-nowrap">
        SIGNATURES
      </h1>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full my-auto">
        
        {/* Left Column: Editorial Headline & Page Navigation Controls */}
        <div className="lg:col-span-4 flex flex-col items-start gap-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#A67C43] font-semibold">
            Based in Ilorin • Genuine Leather, Wears and Swiss Sourced Timepieces
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-neutral-900 leading-[1.08]">
            Genuine pieces, <br />
            <span className="italic font-normal text-[#B38344]">curated from Ilorin.</span>
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-sm">
            Every piece we carry is genuine leather bags, wears, and wristwatches sourced directly from various makers. Every order is inspected before insured worldwide delivery.
          </p>
          
          <div className="flex items-center gap-4 pt-2">
            <a
              href="#catalogue"
              className="px-7 py-3.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition shadow-sm inline-block"
            >
              Explore Collections &rarr;
            </a>
            <a
              href="#lookbook"
              className="px-7 py-3.5 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white transition inline-block"
            >
              View Lookbook
            </a>
          </div>

          {/* Prev/Next Navigation Controls for Floating Card Selection */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-white transition cursor-pointer"
              aria-label="Previous timepiece"
            >
              &lsaquo;
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Next timepiece"
            >
              &rsaquo;
            </button>
            <span className="text-xs text-neutral-500 font-mono ml-2">
              0{currentIndex + 1} / 0{timepieces.length}
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-medium tracking-wider text-neutral-700 uppercase pt-2">
            <span>&bull; 100% Genuine</span>
            <span>&bull; Worldwide Insured Delivery</span>
          </div>
        </div>

        {/* Center Column: FIXED Signature Model Photo (Never Swapped, Seamless & Photorealistic) */}
        <div className="lg:col-span-5 relative flex items-end justify-center self-end">
          <div
            className="relative w-full max-w-[480px] lg:max-w-[520px] aspect-[3/4]"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
            }}
          >
            {/* Fixed Model with Photorealistic Signature Watch */}
            <Image
              src="/images/model-cutout.png"
              alt="Omo Esho Model wearing signature timepiece"
              fill
              priority
              className="object-contain object-bottom select-none pointer-events-none z-10"
            />
          </div>
        </div>

        {/* Right Column: Floating Product Card & Thumbnail Rail */}
        <div
          className="lg:col-span-3 flex flex-col gap-5 justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Floating Product Card with Cycling Content */}
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-[#B38344] uppercase">
                ✦ Swiss Watch
              </span>

              {/* Dynamic Badge: "Active on Wrist" only for Signature Watch */}
              {activeWatch.isSignature ? (
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Active on Wrist
                </span>
              ) : (
                <span className="text-[9px] bg-neutral-100 text-neutral-600 font-medium px-2.5 py-0.5 rounded-full border border-neutral-200">
                  Available in Store
                </span>
              )}
            </div>
            
            {/* Card Content Cross-fade: Thumbnail Image + Title + Tagline + Price */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWatch.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 flex flex-col"
              >
                {/* Product Thumbnail inside Card (Real product photography) */}
                <div className="relative w-full h-36 bg-[#FDFBF7] rounded-xl border border-neutral-100/90 flex items-center justify-center p-2.5 mb-3 overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={activeWatch.thumbImg}
                      alt={activeWatch.name}
                      fill
                      className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
                    />
                  </div>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                  {activeWatch.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed line-clamp-2">
                  {activeWatch.tagline}
                </p>
                
                <div className="mt-3 flex items-baseline justify-between border-t border-neutral-100 pt-3">
                  <span className="text-xl font-bold text-neutral-900">{activeWatch.price}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">NGN / Insured</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Direct WhatsApp Order CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 py-3 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              <span>💬</span> Order on WhatsApp
            </a>
          </div>

          {/* 6 Selector Thumbnails Rail */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 mb-2.5">
              <span>Curated Selection (0{currentIndex + 1}/06)</span>
              <span className="text-[10px] text-neutral-400">Click to switch</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2.5">
              {timepieces.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden p-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    currentIndex === idx
                      ? 'bg-[#FDFBF7] border-2 border-[#B38344] shadow-sm scale-105 ring-2 ring-[#B38344]/15'
                      : 'bg-[#FDFBF7] border border-neutral-200/80 hover:border-neutral-300 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Select ${item.name}`}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={item.thumbImg}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
