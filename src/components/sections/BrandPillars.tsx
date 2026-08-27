import React from 'react';
import { Globe, ShieldCheck, Gem, Gift } from 'lucide-react';

export default function BrandPillars() {
  const pillars = [
    {
      icon: Globe,
      title: 'Global Express Courier',
      description: 'Complimentary insured shipping on all orders over ₦250,000 with signature delivery.',
    },
    {
      icon: ShieldCheck,
      title: '100% Certified Authenticity',
      description: 'Every gemstone, timepiece, and leather good includes registered certificates of origin.',
    },
    {
      icon: Gem,
      title: 'Master Artisanship',
      description: 'Meticulously handcrafted in Italian and Swiss ateliers with lifetime setting warranty.',
    },
    {
      icon: Gift,
      title: 'Signature Velvet Presentation',
      description: 'Each piece arrives encased in our bespoke monogrammed box with custom ribbon.',
    },
  ];

  return (
    <section id="heritage" className="py-10 sm:py-12 lg:py-16 bg-[#0B0D11] border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 active:border-[#D4AF37]/40 transition-all group touch-manipulation"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-serif text-[15px] sm:text-base font-medium text-white mb-1.5 sm:mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[13px] sm:text-xs text-gray-400 font-light leading-relaxed">
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
