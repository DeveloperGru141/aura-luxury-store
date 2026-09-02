'use client';

import React from 'react';
import { Globe, ShieldCheck, Gem, Gift } from 'lucide-react';

export default function BrandPillars() {
  const pillars = [
    {
      icon: Globe,
      title: 'Insured courier',
      description: 'Free insured delivery over ₦250,000. Ilorin next-day, rest of Nigeria 2–3 days, signature required.',
    },
    {
      icon: ShieldCheck,
      title: 'Certificates included',
      description: 'Each piece ships with its atelier card and material certificate — calibre, leather lot or gold weight noted.',
    },
    {
      icon: Gem,
      title: 'Small-run ateliers',
      description: 'Genuine leather bags, silk wears, shoes from Marche, calibres from Switzerland — curated in small runs of 25–50.',
    },
    {
      icon: Gift,
      title: 'Boxed for gifting',
      description: 'Monogrammed rigid box, dust bag and ribbon. Add a handwritten note at checkout via WhatsApp.',
    },
  ];

  return (
    <section id="heritage" className="bg-[var(--color-surface-alt)] border-y border-[var(--color-border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 snap-x snap-mandatory scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="snap-start shrink-0 w-[260px] sm:w-auto flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-white border border-[var(--color-border)] hover:border-[var(--color-accent-gold)]/40 hover:shadow-[var(--shadow-elev-1)] active:scale-[0.97] transition-all group touch-manipulation"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#9A7B1F]/10 border border-[#9A7B1F]/25 text-[#7A5F12] flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#9A7B1F] group-hover:text-white group-hover:border-[#9A7B1F] transition-all shadow-sm">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-[14px] sm:text-sm font-semibold text-[var(--color-text-primary)] mb-1.5 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[12px] sm:text-xs text-[var(--color-text-tertiary)] font-light leading-relaxed">
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
