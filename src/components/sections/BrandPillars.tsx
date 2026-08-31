'use client';

import React from 'react';
import { Globe, ShieldCheck, Gem, Gift } from 'lucide-react';

export default function BrandPillars() {
  const pillars = [
    {
      icon: Globe,
      title: 'Insured courier',
      description: 'Free insured delivery over ₦250,000. Next-day delivery in Ilorin; 2–3 days nationwide across Nigeria.',
    },
    {
      icon: ShieldCheck,
      title: 'Certificates included',
      description: 'Every piece ships with its atelier card and material certificate issued directly from our Ilorin atelier.',
    },
    {
      icon: Gem,
      title: 'Small-run ateliers',
      description: 'Crafted in small batches of 25–50 pieces, ensuring strict quality control and exclusivity.',
    },
    {
      icon: Gift,
      title: 'Gifting packaging',
      description: 'Monogrammed rigid box, dust bag, and ribbon. Add a personalized handwritten note via WhatsApp concierge.',
    },
  ];

  return (
    <section id="heritage" className="bg-[#0B0D11] border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 snap-x snap-mandatory scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="snap-start shrink-0 w-[260px] sm:w-auto flex flex-col items-center text-center p-4 sm:p-5 lg:p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#8C7A5B]/40 active:border-[#8C7A5B]/60 transition-all group touch-manipulation relative overflow-hidden shadow-lg active:scale-[0.97]"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#8C7A5B]/10 border border-[#8C7A5B]/30 text-[#8C7A5B] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 group-hover:bg-[#8C7A5B] group-hover:text-black transition-all shadow-md">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
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
