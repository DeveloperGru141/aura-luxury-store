'use client';

import React from 'react';
import { Globe, ShieldCheck, Gem, Gift, Sparkles } from 'lucide-react';

export default function BrandPillars() {
  const marqueeItems = [
    'SWISS TIMEPIECES CALIBRES',
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
      {/* 1. Infinite Luxury Ticker Marquee Bar */}
      <div className="py-3 bg-gradient-to-r from-[#0E1117] via-[#151922] to-[#0E1117] border-b border-white/5 overflow-hidden flex items-center">
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

      {/* 2. Luxury Trust Pillars — Mobile Swipeable Snap Cards & Desktop Grid */}
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
