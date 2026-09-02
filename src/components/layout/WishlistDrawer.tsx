'use client';

import React from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { X, Heart, Trash2, ShoppingBag, Star } from 'lucide-react';

export default function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    setQuickViewProduct,
    formatPrice,
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-6 justify-end">
        <div className="w-[100vw] sm:w-screen max-w-[92vw] sm:max-w-md bg-white border-l border-[var(--color-border)] text-[var(--color-text-primary)] shadow-xl flex flex-col justify-between overflow-hidden animate-slide-in">
          <div className="p-4 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2 min-w-0">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
              <h2 className="font-serif text-base sm:text-lg font-medium truncate">Saved Pieces</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text-secondary)] shrink-0">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors shrink-0"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3 sm:space-y-4 pb-[env(safe-area-inset-bottom)] bg-[var(--color-surface-alt)]">
            {wishlist.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] mb-3 shadow-sm">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] max-w-xs mb-6">
                  Save your favorite pieces by clicking the heart icon on any product.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] text-black text-xs font-semibold shadow-sm active:scale-[0.97] transition-all"
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              wishlist.map(({ product }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-2xl bg-white border border-[var(--color-border)] hover:border-[var(--color-accent-gold)]/30 hover:shadow-sm transition-all"
                >
                  <div
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setQuickViewProduct(product);
                    }}
                    className="relative w-20 h-24 rounded-xl overflow-hidden bg-[var(--color-surface-alt)] shrink-0 cursor-pointer border border-[var(--color-border)]"
                  >
                    <Image src={product.primaryImage} alt={product.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-accent-gold)]">
                          {product.categoryLabel}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="text-[var(--color-text-tertiary)] hover:text-rose-500 transition-colors p-1.5 rounded-full hover:bg-rose-50"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4
                        onClick={() => {
                          setIsWishlistOpen(false);
                          setQuickViewProduct(product);
                        }}
                        className="font-medium text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="text-[var(--color-text-secondary)]">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--color-border)]">
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => {
                          addToCart(product);
                          toggleWishlist(product);
                        }}
                        className="py-1.5 px-3 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] text-black text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm active:scale-[0.97]"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
