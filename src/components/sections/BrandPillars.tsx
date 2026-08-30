'use client';

import React, { useState } from 'react';
import { Globe, ShieldCheck, Gem, Gift, Sparkles, Copy, Check, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function BrandPillars() {
  const { showToast } = useStore();
  const [copied, setCopied] = useState(false);

  const promoCode = 'TIMELESS15';

  const copyPromo = () => {
    navigator.clipboard?.writeText(promoCode);
    setCopied(true);
    showToast('VIP Voucher "TIMELESS15" copied! 15% off applied to your session.', 'success');
    setTimeout(() => setCopied(false), 2200);
  };

  const marqueeItems = [
    'SWISS HOROLOGY CALIBRES',
    'HAND-BURNISHED ITALIAN LEATHERS',
    'BESPOKE EVENING WEARS',
    'NATIONWIDE INSURED COURIER',
    '100% CERTIFIED ORIGIN',
    '24/7 PRIVATE CLIENT CONCIERGE',
  ];

  const pillars = [
    {
      icon: Globe,
      badge: 'COMPLIMENTARY',
      title: 'Global Express Courier',
      description: 'Complimentary insured shipping on all orders over ₦250,000 with signature delivery.',
    },
    {
      icon: ShieldCheck,
      badge: 'VERIFIED',
      title: '100% Certified Authenticity',
      description: 'Every gemstone, timepiece, and leather good includes registered certificates of origin.',
    },
    {
      icon: Gem,
      badge: 'ARTISANAL',
      title: 'Master Artisanship',
      description: 'Meticulously handcrafted in Italian and Swiss ateliers with lifetime setting warranty.',
    },
    {
      icon: Gift,
      badge: 'SIGNATURE',
      title: 'Signature Velvet Presentation',
      description: 'Each piece arrives encased in our bespoke monogrammed box with custom ribbon.',
    },
  ];

  return (
    <section id="heritage" className="bg-[#0B0D11] border-t border-b border-white/5 relative overflow-hidden">
      {/* 1. Infinite Luxury Ticker Marquee Bar — Visible on all devices */}
      <div className="py-2.5 sm:py-3 bg-gradient-to-r from-[#0E1117] via-[#151922] to-[#0E1117] border-b border-white/5 overflow-hidden flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 sm:gap-8 text-[10px] sm:text-xs font-serif uppercase tracking-[0.22em] text-gray-300">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((text, idx) => (
            <div key={idx} className="inline-flex items-center gap-2.5 sm:gap-3 shrink-0">
              <span className="text-[#D4AF37]">&bull;</span>
              <span className="text-gray-300 font-medium tracking-[0.22em]">{text}</span>
              <Sparkles className="w-3 h-3 text-[#D4AF37]/80 shrink-0 ml-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive VIP Promotion Banner — High-contrast Mobile & Desktop */}
      <div className="bg-[#12151D] border-b border-[#D4AF37]/20 px-4 sm:px-6 py-3 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            <span className="font-light">
              Private Atelier Allocation &bull; <strong className="font-semibold text-white">Save 15% on your inaugural order</strong>
            </span>
          </div>

          <button
            onClick={copyPromo}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 active:bg-[#D4AF37]/35 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-mono font-bold transition-all shadow-md touch-manipulation cursor-pointer group"
          >
            <span>Code: <span className="underline decoration-[#D4AF37]/50 underline-offset-2">{promoCode}</span></span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Luxury Trust Pillars — Mobile Swipeable Snap Cards & Desktop Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 snap-x snap-mandatory scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="snap-start shrink-0 w-[260px] sm:w-auto flex flex-col items-center text-center p-4 sm:p-5 lg:p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 active:border-[#D4AF37]/60 transition-all group touch-manipulation relative overflow-hidden shadow-lg"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 group-hover:bg-[#D4AF37] group-hover:text-black transition-all shadow-md">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#D4AF37] mb-1">
                  {item.badge}
                </span>
                <h3 className="font-serif text-[15px] sm:text-base font-medium text-white mb-1.5 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[12px] sm:text-xs text-gray-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
