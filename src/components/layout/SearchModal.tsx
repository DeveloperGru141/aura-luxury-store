'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types/store';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct } = useStore();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { products: liveProducts, loading: productsLoading } = useLiveProducts();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const isSearching = productsLoading || (query.trim() && !debouncedQuery.trim());

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return liveProducts.filter(
      (p: Product) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        (p.tagline ?? p.description ?? '').toLowerCase().includes(q) ||
        (p.materials ?? []).some((m: string) => m.toLowerCase().includes(q))
    );
  }, [debouncedQuery, liveProducts]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:pt-16 px-0 sm:px-4 pb-0 sm:pb-4 bg-black/40 backdrop-blur-sm animate-fade-in overscroll-contain touch-manipulation">
      <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />

      <div className="relative z-10 w-full max-w-2xl max-h-[92dvh] sm:max-h-[80vh] bg-white border border-[var(--color-border)] rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6 text-[var(--color-text-primary)] overflow-hidden flex flex-col animate-slide-up sm:animate-scale-in">
        <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-[var(--color-border)]">
          <Search className="w-5 h-5 text-[var(--color-accent-gold)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bags, silk dresses, watches, gold jewelry..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-[16px] sm:text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-xs hover:bg-[var(--color-surface-alt)] rounded-full transition-colors shrink-0"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] active:scale-95 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!debouncedQuery && (
          <div className="py-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Croc Bag', 'Rose Gold Watch', 'Silk Gown', '18k Choker', 'Loafers', 'Zambian Emerald'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 rounded-full bg-white border border-[var(--color-border)] hover:border-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-light)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all flex items-center gap-1.5 shadow-sm hover:shadow-sm"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 text-[var(--color-accent-gold)]" />
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {debouncedQuery && (
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-[var(--color-accent-gold)] animate-spin" />
                <span className="ml-2 text-xs text-[var(--color-text-tertiary)]">Searching&hellip;</span>
              </div>
            )}

            {!isSearching && (
              <>
                <p className="text-xs font-medium text-[var(--color-text-tertiary)] mb-3">
                  Found {filtered.length} {filtered.length === 1 ? 'item' : 'items'} matching &ldquo;{debouncedQuery}&rdquo;
                </p>

                {filtered.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">No luxury items match your criteria.</p>
                    <p className="text-xs mt-1 text-[var(--color-text-tertiary)]">Try searching for &ldquo;Watches&rdquo;, &ldquo;Silk&rdquo;, &ldquo;Gold&rdquo;, or &ldquo;Satchel&rdquo;</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filtered.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setQuickViewProduct(item);
                        }}
                        className="cursor-pointer"
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
