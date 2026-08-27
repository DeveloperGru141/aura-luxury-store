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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-6 justify-end">
        <div className="w-[100vw] sm:w-screen max-w-[92vw] sm:max-w-md bg-[#11141A] border-l border-white/10 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header — fluid */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400 shrink-0" />
              <h2 className="font-serif text-base sm:text-lg font-medium truncate">Saved Pieces</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 shrink-0">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation shrink-0"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List — fluid */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3 sm:space-y-4 pb-[env(safe-area-inset-bottom)] touch-manipulation">
            {wishlist.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-medium text-gray-200 mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-gray-400 max-w-xs mb-6">
                  Save your favorite pieces by clicking the heart icon on any product.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              wishlist.map(({ product }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#D4AF37]/20 transition-all"
                >
                  {/* Image */}
                  <div
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setQuickViewProduct(product);
                    }}
                    className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-800 shrink-0 cursor-pointer"
                  >
                    <Image src={product.primaryImage} alt={product.name} fill className="object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
                          {product.categoryLabel}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="text-gray-500 hover:text-rose-400 transition-colors p-1"
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
                        className="font-serif text-sm font-medium text-white hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                      <span className="text-sm font-semibold text-[#F3E5AB]">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => {
                          addToCart(product);
                          toggleWishlist(product);
                        }}
                        className="py-1.5 px-3 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
