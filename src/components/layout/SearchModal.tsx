'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/data/mockData';
import { Search, X, Star, ArrowRight } from 'lucide-react';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct, formatPrice } = useStore();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.materials.some((m) => m.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[max(1rem,env(safe-area-inset-top))] sm:pt-20 px-3 sm:px-4 bg-black/85 backdrop-blur-md animate-fade-in overscroll-contain touch-manipulation">
      <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />

      <div className="relative z-10 w-full max-w-2xl max-h-[88dvh] sm:max-h-none bg-[#12151B] border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-4 sm:p-6 text-white overflow-hidden flex flex-col animate-scale-in">
        {/* Search Header — fluid */}
        <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-white/10">
          <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bags, silk dresses, watches, gold jewelry..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-[16px] sm:text-base text-white placeholder-gray-500 font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-white active:text-white p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-xs touch-manipulation shrink-0"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/15 touch-manipulation shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="py-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Croc Bag', 'Rose Gold Watch', 'Silk Gown', '18k Choker', 'Loafers', 'Zambian Emerald'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/40 border border-white/5 text-xs text-gray-300 transition-all flex items-center gap-1.5"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Results View */}
        {query && (
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <p className="text-xs font-medium text-gray-400 mb-3">
              Found {filtered.length} {filtered.length === 1 ? 'item' : 'items'} matching &ldquo;{query}&rdquo;
            </p>

            {filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="text-sm font-medium">No luxury items match your criteria.</p>
                <p className="text-xs mt-1 text-gray-500">Try searching for &quot;Watches&quot;, &quot;Silk&quot;, &quot;Gold&quot;, or &quot;Satchel&quot;</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setQuickViewProduct(item);
                    }}
                    className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                        <Image
                          src={item.primaryImage}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-[#D4AF37]">
                          {item.categoryLabel}
                        </span>
                        <h4 className="text-sm font-serif font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{item.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#F3E5AB]">
                        {formatPrice(item.price)}
                      </p>
                      <span className="text-[11px] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                        View Item &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
