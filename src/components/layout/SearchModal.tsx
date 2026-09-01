'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { Search, X, Star, ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct, formatPrice } = useStore();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { products: liveProducts, loading: productsLoading } = useLiveProducts();
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce the search query
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 300);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Trigger loading state when query changes (after debounce)
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [debouncedQuery]);

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return liveProducts.filter(
      (p: any) =>
        p.name.toLowerCase().includes(q) ||
        (p.categoryLabel ?? p.categories?.name ?? '').toLowerCase().includes(q) ||
        (p.tagline ?? p.description ?? '').toLowerCase().includes(q) ||
        (p.materials ?? []).some((m: string) => m.toLowerCase().includes(q))
    );
  }, [debouncedQuery, liveProducts]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:pt-20 px-0 sm:px-4 pb-0 sm:pb-4 bg-black/85 backdrop-blur-md animate-fade-in overscroll-contain touch-manipulation">
      <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />

      <div className="relative z-10 w-full max-w-2xl max-h-[88dvh] sm:max-h-[80vh] bg-[#12151B] border-t sm:border border-[#8C7A5B]/30 rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6 text-white overflow-hidden flex flex-col animate-slide-up sm:animate-scale-in">
        {/* Search Header — fluid */}
        <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-white/10">
          <Search className="w-5 h-5 text-[#8C7A5B] shrink-0" />
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
        {!debouncedQuery && (
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
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#8C7A5B]/15 hover:border-[#8C7A5B]/40 border border-white/5 text-xs text-gray-300 transition-all flex items-center gap-1.5"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 text-[#8C7A5B]" />
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Results View */}
        {debouncedQuery && (
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {/* Loading indicator */}
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-[#8C7A5B] animate-spin" />
                <span className="ml-2 text-xs text-gray-400">Searching...</span>
              </div>
            )}

            {!isSearching && (
              <>
                <p className="text-xs font-medium text-gray-400 mb-3">
                  Found {filtered.length} {filtered.length === 1 ? 'item' : 'items'} matching &ldquo;{debouncedQuery}&rdquo;
                </p>

                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <p className="text-sm font-medium">No luxury items match your criteria.</p>
                    <p className="text-xs mt-1 text-gray-500">Try searching for "Watches", "Silk", "Gold", or "Satchel"</p>
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
                        className="group flex flex-col rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#8C7A5B]/30 transition-all cursor-pointer"
                      >
                        <ProductCard product={item} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}