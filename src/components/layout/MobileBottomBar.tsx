'use client';

import React from 'react';
import { MessageCircle, SlidersHorizontal } from 'lucide-react';
import { getWhatsAppConciergeUrl } from '@/lib/whatsapp';
import { useStore } from '@/context/StoreContext';

export default function MobileBottomBar({ onFilterTap }: { onFilterTap?: () => void }) {
  const conciergeUrl = getWhatsAppConciergeUrl();
  const handleFilter = () => {
    if (onFilterTap) onFilterTap();
    else document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="mx-auto max-w-7xl px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 bg-gradient-to-t from-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2 rounded-2xl bg-white border border-[#E2DDD5] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1.5">
          {/* Quick-filter toggle — 44px */}
          <button
            onClick={handleFilter}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] text-[#121212] text-xs font-semibold active:scale-95 transition-transform"
            aria-label="Quick filter catalogue"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#9A7B2C]" />
            <span>Filter</span>
          </button>
          {/* Primary WhatsApp concierge — 44px */}
          <a
            href={conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-[1.6] min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#121212] text-white text-xs font-semibold active:scale-95 transition-transform"
          >
            <MessageCircle className="h-4 w-4 text-[#8C7A5B]" />
            <span>Chat with Concierge</span>
          </a>
        </div>
        <p className="text-center text-[10px] text-white/70 mt-1.5 drop-shadow">Ilorin atelier — typical response under 15 mins</p>
      </div>
    </div>
  );
}
