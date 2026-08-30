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
    <aside aria-label="Luxury Concierge" className="bg-[#080A0E] border-b border-white/5 text-gray-300 text-xs py-2 px-4 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Shipping perk */}
        <div className="hidden lg:flex items-center gap-2 text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          <span>Complimentary insured express courier on orders over ₦250,000</span>
        </div>

        {/* Center: WhatsApp Direct Order Hotline */}
        <div className="flex items-center gap-2">
          <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="font-light text-gray-300">
            Direct Client Orders &amp; Inquiries:
          </span>
          <a
            href={conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#F3E5AB] hover:underline transition-all"
          >
            <span>+234 706 507 6565</span>
          </a>
        </div>

        {/* Right: Currency Selector */}
        <div className="hidden sm:flex items-center gap-4 text-gray-400 relative">
          <div className="relative">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors py-0.5 cursor-pointer"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-1.5 w-24 bg-[#14171D] border border-white/10 rounded-lg shadow-xl py-1 z-50">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-white/10 transition-colors text-xs cursor-pointer ${
                      currency === curr ? 'text-[#D4AF37] font-semibold' : 'text-gray-300'
                    }`}
                  >
                    {curr} {curr === 'NGN' ? '(₦)' : curr === 'USD' ? '($)' : '(£)'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="h-3 w-px bg-white/10" />
          <a href="#catalogue" className="hover:text-[#D4AF37] transition-colors">
            Collections
          </a>
        </div>
      </div>
    </aside>
  );
}
