'use client';

import React, { useState } from 'react';
import { useStore, Currency } from '@/context/StoreContext';
import { Sparkles, Copy, Check, ChevronDown } from 'lucide-react';

export default function AnnouncementBar() {
  const { currency, setCurrency, showToast } = useStore();
  const [copied, setCopied] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const promoCode = 'LUXE15';

  const copyPromo = () => {
    navigator.clipboard?.writeText(promoCode);
    setCopied(true);
    showToast('Promo code "LUXE15" copied to clipboard! (15% OFF)', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const currencies: Currency[] = ['USD', 'EUR', 'GBP'];

  return (
    <aside aria-label="Special Offers" className="bg-[#0A0C0F] border-b border-white/5 text-gray-300 text-xs py-2 px-4 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Shipping perk */}
        <div className="hidden lg:flex items-center gap-2 text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          <span>Complimentary worldwide express courier on orders over $300</span>
        </div>

        {/* Center: Promo Banner */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span className="font-medium text-gray-200">
            Autumn Haute Collection Drop &mdash; Save 15% with code
          </span>
          <button
            onClick={copyPromo}
            className="inline-flex items-center gap-1 font-mono font-bold text-[#F3E5AB] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 px-2 py-0.5 rounded border border-[#D4AF37]/30 transition-all cursor-pointer"
            title="Click to copy promo code"
          >
            <span>{promoCode}</span>
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#D4AF37]" />}
          </button>
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
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="h-3 w-px bg-white/10" />
          <a href="#vip" className="hover:text-[#D4AF37] transition-colors">
            VIP Atelier
          </a>
        </div>
      </div>
    </aside>
  );
}
