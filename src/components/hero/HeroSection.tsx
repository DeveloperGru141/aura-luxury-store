'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

const timepieces = [
  {
    id: 1,
    name: 'Patek Philippe Aquanaut Orange',
    tagline: 'Swiss precision movement',
    price: '₦240,000',
    wristImg: '/images/watches/watch-1.png',
    thumbImg: '/images/watches/watch-1.png',
    // Fine-tune offset & rotation to seat naturally along the forearm
    wristAdjustment: { top: '53.5%', left: '53.2%', rotate: -28, scale: 1.0 },
  },
  {
    id: 2,
    name: 'Patek Philippe Tourbillon Skeleton',
    tagline: 'Rose gold & ceramic link',
    price: '₦380,000',
    wristImg: '/images/watches/watch-2.png',
    thumbImg: '/images/watches/watch-2.png',
    wristAdjustment: { top: '53.2%', left: '53.0%', rotate: -26, scale: 1.02 },
  },
  {
    id: 3,
    name: 'Patek Philippe AET Remould',
    tagline: 'Tiffany turquoise ceramic edition',
    price: '₦310,000',
    wristImg: '/images/watches/watch-3.png',
    thumbImg: '/images/watches/watch-3.png',
    wristAdjustment: { top: '53.5%', left: '53.3%', rotate: -28, scale: 0.98 },
  },
  {
    id: 4,
    name: 'Patek Philippe Aquanaut Chrono',
    tagline: 'Black embossed dial & composite strap',
    price: '₦260,000',
    wristImg: '/images/watches/watch-4.png',
    thumbImg: '/images/watches/watch-4.png',
    wristAdjustment: { top: '53.6%', left: '53.2%', rotate: -28, scale: 1.0 },
  },
  {
    id: 5,
    name: 'Exhibition Calibre Movement',
    tagline: '22k Gold rotor Swiss caseback',
    price: '₦290,000',
    wristImg: '/images/watches/watch-5.png',
    thumbImg: '/images/watches/watch-5.png',
    wristAdjustment: { top: '53.5%', left: '53.2%', rotate: 0, scale: 0.95 },
  },
  {
    id: 6,
    name: 'Poedagar Classic Date',
    tagline: 'Emerald leather & silver sunray dial',
    price: '₦120,000',
    wristImg: '/images/watches/watch-6.png',
    thumbImg: '/images/watches/watch-6.png',
    wristAdjustment: { top: '53.4%', left: '53.1%', rotate: -27, scale: 0.97 },
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeWatch = timepieces[currentIndex];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % timepieces.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + timepieces.length) % timepieces.length);

  const whatsappUrl = getWhatsAppOrderUrl(activeWatch.name, activeWatch.price);

  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full bg-[#FAF7F2] overflow-hidden flex flex-col justify-between px-6 lg:px-14 py-8">
      {/* Background Subtle Watermark */}
      <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-light tracking-widest text-[#EADBCE]/40 select-none pointer-events-none z-0 whitespace-nowrap">
        SIGNATURES
      </h1>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full my-auto">
        
        {/* Left Editorial Text */}
        <div className="lg:col-span-4 flex flex-col items-start gap-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#A67C43] font-semibold">
            Based in Ilorin Genuine Leather, Wears and Swiss Sourced Timepieces
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

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-white transition cursor-pointer"
              aria-label="Previous watch"
            >
              &lsaquo;
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Next watch"
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

        {/* Center: Model Cutout + Pinned Wrist Transition Layer */}
        <div className="lg:col-span-5 relative flex justify-center items-end">
          <div className="relative w-full max-w-[440px] aspect-[3/4]">
            {/* Base Model */}
            <Image
              src="/images/model-cutout.png"
              alt="Omo Esho Model"
              fill
              priority
              className="object-contain object-bottom select-none pointer-events-none z-10"
            />

            {/* Dynamic Wrist Slot */}
            <div
              className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-[72px] sm:w-[84px] aspect-square flex items-center justify-center"
              style={{
                top: activeWatch.wristAdjustment.top,
                left: activeWatch.wristAdjustment.left,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWatch.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: 1,
                    scale: activeWatch.wristAdjustment.scale,
                    rotate: activeWatch.wristAdjustment.rotate,
                  }}
                  exit={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeWatch.wristImg}
                    alt={activeWatch.name}
                    fill
                    className="object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.35)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Product Card & 6-Thumbnail Switcher */}
        <div className="lg:col-span-3 flex flex-col gap-5 justify-center">
          {/* Active Product Floating Card */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-[#B38344] uppercase">
                ✦ Swiss Watch
              </span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                Active on Wrist
              </span>
            </div>
            
            <h3 className="font-serif text-lg font-bold text-neutral-900 mt-2 leading-snug">
              {activeWatch.name}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">{activeWatch.tagline}</p>
            
            <div className="mt-4 flex items-baseline justify-between border-t border-neutral-100 pt-3">
              <span className="text-xl font-bold text-neutral-900">{activeWatch.price}</span>
              <span className="text-[10px] text-neutral-400">NGN / Insured</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 py-3 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>💬</span> Order on WhatsApp
            </a>
          </div>

          {/* 6 Selector Thumbnails */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 mb-2.5">
              <span>Select Timepiece (0{currentIndex + 1}/06)</span>
              <span className="text-[10px] text-neutral-400">Click to switch</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2.5">
              {timepieces.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden p-1.5 transition-all duration-200 cursor-pointer ${
                    currentIndex === idx
                      ? 'border-2 border-[#B38344] bg-white shadow-md scale-105'
                      : 'border border-neutral-200/80 bg-white/60 hover:border-neutral-300 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Select ${item.name}`}
                >
                  <div className="relative w-full h-full">
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
