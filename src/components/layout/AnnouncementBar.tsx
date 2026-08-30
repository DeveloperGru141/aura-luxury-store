'use client';

import React, { useState } from 'react';
import { useStore, Currency } from '@/context/StoreContext';
import { Sparkles, Copy, Check, ChevronDown } from 'lucide-react';

export default function AnnouncementBar() {
  const { currency, setCurrency, showToast } = useStore();
  const [copied, setCopied] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);


  const currencies: Currency[] = ['NGN', 'USD', 'GBP'];

  return (
    <aside aria-label="Special Offers" className="bg-[#0A0C0F] border-b border-white/5 text-gray-300 text-xs py-2 px-4 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Shipping perk */}
        <div className="hidden lg:flex items-center gap-2 text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          <span></span>
        </div>

        {/* Right: Currency Selector */}
        <div className="hidden sm:flex items-center gap-4 text-gray-400 relative">
          <div className="relative">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors py-0.5"
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
                    className={`w-full text-left px-3 py-1.5 hover:bg-white/10 transition-colors text-xs ${
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
