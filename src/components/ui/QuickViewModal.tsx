'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import Badge from './Badge';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check, Sparkles } from 'lucide-react';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIndex(0);
      setSelectedColor(quickViewProduct.colors[0]?.name || '');
      setSelectedSize(quickViewProduct.sizes ? quickViewProduct.sizes[0] : undefined);
      setQuantity(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const images = [
    quickViewProduct.primaryImage,
    ...(quickViewProduct.secondaryImage ? [quickViewProduct.secondaryImage] : []),
  ];

  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedColor, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-black/80 backdrop-blur-md animate-fade-in overscroll-contain touch-manipulation">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={() => setQuickViewProduct(null)} />

      {/* Modal Container — fluid, safe-area */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl bg-[#11141A] border border-[#D4AF37]/30 shadow-2xl flex flex-col md:flex-row text-white">
        {/* Close Button — 44px hit */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 text-gray-400 hover:text-white hover:bg-black/90 active:bg-black transition-all border border-white/10 touch-manipulation"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images Showcase — fluid padding */}
        <div className="md:w-1/2 flex flex-col p-4 sm:p-6 gap-3 sm:gap-4 bg-[#0A0C0F]/50">
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#181C24] border border-white/5">
            <Image
              src={images[activeImageIndex]}
              alt={quickViewProduct.name}
              fill
              className="object-cover object-center transition-all duration-500"
            />
            {quickViewProduct.badge && (
              <div className="absolute top-4 left-4">
                <Badge type={quickViewProduct.badge} />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#D4AF37] scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details — fluid */}
        <div className="md:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Category & Ratings */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
                {quickViewProduct.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400 text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-semibold">{quickViewProduct.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-xs">({quickViewProduct.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2 leading-tight">
              {quickViewProduct.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[#F3E5AB]">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-base text-gray-500 line-through">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
              {quickViewProduct.originalPrice && (
                <span className="text-xs font-semibold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-500/20">
                  Save {formatPrice(quickViewProduct.originalPrice - quickViewProduct.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              {quickViewProduct.description}
            </p>

            {/* Color Selection */}
            {quickViewProduct.colors.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between text-xs font-medium text-gray-300 mb-2">
                  <span>Selected Finish: <strong className="text-white">{selectedColor}</strong></span>
                </div>
                <div className="flex gap-2.5">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                        selectedColor === c.name
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                          : 'border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs font-medium text-gray-300 mb-2">
                  <span>Select Size</span>
                  <span className="text-[#D4AF37] cursor-pointer hover:underline text-[11px]">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedSize === s
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-black font-semibold'
                          : 'border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Specifications Preview */}
            <div className="grid grid-cols-2 gap-2 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 mb-6">
              {quickViewProduct.specs.slice(0, 2).map((spec, idx) => (
                <div key={idx}>
                  <span className="text-gray-400 block text-[11px]">{spec.label}</span>
                  <span className="text-white font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row — fluid */}
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              {/* Quantity Controls — 44px */}
              <div className="flex items-center justify-between sm:justify-start rounded-xl border border-white/15 bg-white/5 p-1 w-full sm:w-auto">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors text-base font-semibold touch-manipulation"
                >
                  -
                </button>
                <span className="w-12 sm:w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors text-base font-semibold touch-manipulation"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full">
                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={addedAnimation}
                  className={`flex-1 py-3.5 sm:py-3 px-4 sm:px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg min-h-[44px] touch-manipulation ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#B38F24] text-black hover:brightness-110 active:brightness-95 active:scale-[0.98] shadow-[#D4AF37]/10'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" />
                      <span className="truncate">Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span className="truncate">Add to Bag</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button — 44px */}
                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border transition-all touch-manipulation ${
                    isWishlisted
                      ? 'border-rose-500/50 bg-rose-950/40 text-rose-400'
                      : 'border-white/15 bg-white/5 text-gray-300 hover:text-white hover:border-white/30 active:bg-white/10'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Value Highlights — fluid wrap */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400 pt-3 border-t border-white/5">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> Free Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> Authentic
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> 30-Day Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
