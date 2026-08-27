import React from 'react';
import { ShieldCheck, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08090C] text-gray-400 text-xs border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white flex items-center gap-1.5">
                <span>AURA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-gray-400 font-sans -mt-1">
                Maison de Luxe &bull; Paris &bull; Milan &bull; Geneva
              </span>
            </div>

            <p className="text-gray-400 text-xs font-light max-w-sm leading-relaxed">
              Curating the world&apos;s finest handcrafted leather accessories, haute couture apparel, high-precision Swiss timepieces, and certified fine jewelry for discerning patrons worldwide.
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-300 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Certified Member of the International Horology &amp; Gem Council</span>
            </div>
          </div>

          {/* Col 3: Collections */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5">
              {['Designer Bags', 'Haute Couture', 'Luxury Footwear', 'Swiss Watches', 'Fine Jewelry', 'Limited Runway Drops'].map((item) => (
                <li key={item}>
                  <a href="#categories" className="hover:text-[#D4AF37] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Client Concierge */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Concierge
            </h4>
            <ul className="space-y-2.5">
              {['Track Your Order', 'Certificate Verification', 'Bespoke Sizing & Styling', 'Complimentary Returns', 'Book Private Atelier Appointment'].map((item) => (
                <li key={item}>
                  <a href="#catalogue" className="hover:text-[#D4AF37] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Maison Heritage */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Heritage
            </h4>
            <ul className="space-y-2.5">
              {['The Florence Atelier', 'Ethical Gold & Diamonds', 'Sustainability Charter', 'Global Flagships', 'Press & Media'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#D4AF37] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
            <span>&copy; {new Date().getFullYear()} AURA Luxury Collective S.A. All rights reserved.</span>
            <span className="hidden sm:inline">&bull;</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Luxury Service</a>
          </div>

          {/* Payment Badges & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-gray-400">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">VISA</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">MC</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">AMEX</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">APPLE PAY</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all border border-white/10 text-gray-300"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
