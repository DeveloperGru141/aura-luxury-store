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
    <aside aria-label="Luxury Concierge" className="bg-[#FDFBF7] border-b border-[#E8DDD0] text-[#5A5248] text-xs py-2.5 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left: Human concierge — Ilorin atelier */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E8DDD0] px-2.5 py-1">
            <MessageCircle className="w-3 h-3 text-[#9A7B2C] shrink-0" />
            <span className="font-medium text-[#121212]">Chat directly with our Ilorin atelier concierge</span>
            <span className="text-[#9A7B2C]">— typical response under 15 mins</span>
          </span>
          <span className="sm:hidden inline-flex items-center gap-1 text-[#121212] font-medium truncate">
            <MessageCircle className="w-3.5 h-3.5 text-[#9A7B2C] shrink-0" /> Ilorin atelier — under 15 mins
          </span>
          <a
            href={conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 font-semibold text-[#9A7B2C] hover:text-[#7A5F1E] hover:underline transition-all shrink-0"
          >
            <span>+234 706 507 6565</span>
          </a>
        </div>

        {/* Right: Currency + local trust — Ilorin · Lagos · Abuja · PH */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#8A7F72] shrink-0">
          <span>Ilorin · Lagos · Abuja · Port Harcourt — insured courier</span>
          <span className="h-3 w-px bg-[#E8DDD0] mx-1" />
        </div>
        <div className="flex items-center gap-4 text-[#5A5248] relative shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors py-0.5 cursor-pointer min-h-[44px] px-2 touch-manipulation active:scale-95 transition-transform"
              aria-haspopup="listbox"
              aria-expanded={isCurrencyOpen}
            >
              <span>{currency}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-1.5 w-28 bg-[#14171D] border border-white/10 rounded-lg shadow-xl py-1 z-[60] overflow-hidden">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-white/10 transition-colors text-xs cursor-pointer flex items-center justify-between ${
                      currency === curr ? 'text-[#D4AF37] font-semibold bg-[#D4AF37]/10' : 'text-gray-300'
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
