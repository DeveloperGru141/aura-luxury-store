'use client';

import React, { useState } from 'react';
import { useStore, Currency } from '@/context/StoreContext';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { getWhatsAppConciergeUrl } from '@/lib/whatsapp';

export default function AnnouncementBar() {
  const { currency, setCurrency } = useStore();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const currencies: Currency[] = ['NGN', 'USD', 'GBP'];
  const conciergeUrl = getWhatsAppConciergeUrl();

  return (
    <aside aria-label="Luxury Concierge" className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs py-2.5 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left: WhatsApp Direct Order Hotline */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <MessageCircle className="w-3.5 h-3.5 text-[var(--color-accent-gold)] shrink-0" />
          <span className="hidden sm:inline font-light text-[var(--color-text-secondary)]">
            Direct Client Orders &amp; Inquiries:
          </span>
          <span className="sm:hidden font-light text-[var(--color-text-secondary)] truncate">
            Orders &amp; Inquiries:
          </span>
          <a
            href={conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] transition-colors shrink-0"
          >
            <span>+234 706 507 6565</span>
          </a>
        </div>

        {/* Right: Currency Selector */}
        <div className="flex items-center gap-4 text-[var(--color-text-tertiary)] relative shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors py-0.5 cursor-pointer min-h-[28px] px-2 rounded-full hover:bg-white border border-transparent hover:border-[var(--color-border)]"
              aria-haspopup="listbox"
              aria-expanded={isCurrencyOpen}
            >
              <span>{currency}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-1.5 w-28 bg-white border border-[var(--color-border)] rounded-xl shadow-lg py-1 z-[60] overflow-hidden">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[var(--color-surface-alt)] transition-colors text-xs cursor-pointer flex items-center justify-between ${
                      currency === curr ? 'text-[var(--color-accent-gold)] font-semibold bg-[var(--color-accent-gold-light)]' : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    <span>{curr}</span>
                    <span className="text-[11px] opacity-70">{curr === 'NGN' ? '₦' : curr === 'USD' ? '$' : '£'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
