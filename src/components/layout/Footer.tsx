import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08090C] text-gray-400 text-xs border-t border-white/10 pt-10 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid — fluid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-8 sm:pb-10 lg:pb-12 border-b border-white/10">
          {/* Brand Identity */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-[0.28em] text-white flex items-center gap-1.5">
                <span>TIMELESS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </span>
              <span className="text-[9px] uppercase tracking-[0.38em] text-gray-400 font-sans -mt-1">
                Fine Goods &bull; Wristwatches &bull; Jewelry
              </span>
            </div>

            <p className="text-gray-400 text-xs font-light max-w-md leading-relaxed">
              Curating the finest handcrafted leather bags, bespoke wears, high-precision Swiss wristwatches, and certified fine jewelry for discerning patrons.
            </p>
          </div>

          {/* Collections Column */}
          <div className="md:col-span-4">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Collections
            </h4>
            <ul className="grid grid-cols-2 gap-2.5">
              {['Designer Bags', 'Wears', 'Luxury Shoes', 'Wristwatches', 'Fine Jewelry', 'Lookbook'].map((item) => (
                <li key={item}>
                  <a href={item === 'Lookbook' ? '#lookbook' : '#categories'} className="hover:text-[#D4AF37] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} TIMELESS Luxury Collective. All rights reserved.</span>
            <span className="hidden sm:inline">&bull;</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all border border-white/10 text-gray-300 flex items-center gap-2 text-xs"
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
