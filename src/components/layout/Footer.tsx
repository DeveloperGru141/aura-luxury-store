import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--color-surface)] text-[var(--color-text-tertiary)] text-xs border-t border-[var(--color-border)] pt-10 sm:pt-12 lg:pt-14 pb-8 sm:pb-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-8 sm:pb-10 border-b border-[var(--color-border)]">
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-[0.28em] text-[var(--color-text-primary)] flex items-center gap-1.5">
                <span>OMO ESHO SIGNATURES</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-gold)]" />
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[var(--color-text-tertiary)] font-sans -mt-1">
                ILORIN — worldwide insured courier
              </span>
            </div>

            <p className="text-[var(--color-text-tertiary)] text-xs font-light max-w-md leading-relaxed">
              Every piece we carry is genuine leather bags,wears,genuine leather and wristwatches sourced directly from various makers,we're based in ilorin where every order is inspected before it ships with insured courier delivery worldwide
            </p>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-4">
              Collections
            </h4>
            <ul className="grid grid-cols-2 gap-2.5">
              {['Designer Bags', 'Wears', 'Luxury Shoes', 'Wristwatches', 'Fine Jewelry', 'Lookbook'].map((item) => (
                <li key={item}>
                  <a href={item === 'Lookbook' ? '#lookbook' : '#categories'} className="hover:text-[var(--color-accent-gold)] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-tertiary)] text-center sm:text-left">
            <a href="/admin/login" className="hover:text-[var(--color-text-primary)] transition-colors opacity-60 hover:opacity-100">Admin</a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white border border-[var(--color-border)] hover:border-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all flex items-center gap-2 text-xs shadow-sm"
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
