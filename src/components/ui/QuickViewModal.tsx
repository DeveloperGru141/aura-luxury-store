'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import {
  X,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, formatPrice, toggleWishlist, isInWishlist } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isWishlisted = isInWishlist(quickViewProduct.id);

  const images = [
    quickViewProduct.primaryImage,
    quickViewProduct.secondaryImage,
  ].filter(Boolean);

  const activeColor = selectedColor || quickViewProduct.colors[0]?.name || '';
  const activeSize = selectedSize || (quickViewProduct.sizes?.[0] ?? '');

  const handleClose = () => {
    setQuickViewProduct(null);
    setSelectedImageIndex(0);
    setSelectedColor('');
    setSelectedSize('');
    setQuantity(1);
  };

  const whatsappOrderUrl = getWhatsAppOrderUrl(
    quickViewProduct.name,
    formatPrice(quickViewProduct.price * quantity),
    activeColor,
    activeSize,
    quantity
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content — fluid sizing */}
      <div className="relative w-full max-w-4xl bg-[#12151C] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button — 44px hit */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black text-gray-300 hover:text-white border border-white/10 backdrop-blur-md transition-all touch-manipulation cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery Preview (Responsive) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-[#0E1015] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
          {/* Main Selected Image */}
          <div className="relative aspect-[3/4] sm:aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#181B22] border border-white/5 mb-3 sm:mb-4">
            <Image
              src={images[selectedImageIndex] || quickViewProduct.primaryImage}
              alt={quickViewProduct.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-all duration-500"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all shrink-0 touch-manipulation cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#D4AF37] scale-95 shadow-md'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & WhatsApp Ordering */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="uppercase tracking-widest text-[10px] font-bold text-[#D4AF37]">
                {quickViewProduct.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-semibold text-gray-200">{quickViewProduct.rating.toFixed(1)}</span>
                <span className="text-gray-500">({quickViewProduct.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-white mb-2 leading-tight">
              {quickViewProduct.name}
            </h2>

            {/* Tagline */}
            <p className="text-xs sm:text-sm text-gray-300 font-light mb-4">
              {quickViewProduct.tagline}
            </p>

            {/* Price (Clean without discount strikethrough) */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[#F3E5AB]">
                {formatPrice(quickViewProduct.price)}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 font-light leading-relaxed mb-6 border-t border-b border-white/5 py-3">
              {quickViewProduct.description}
            </p>

            {/* Color Swatch Picker */}
            {quickViewProduct.colors.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between text-xs font-medium text-gray-300 mb-2">
                  <span>Selected Finish: <strong className="text-white">{activeColor}</strong></span>
                </div>
                <div className="flex gap-2.5">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all touch-manipulation cursor-pointer ${
                        activeColor === c.name
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
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all touch-manipulation cursor-pointer ${
                        activeSize === s
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

          {/* Action Row — WhatsApp DM Calling Order */}
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              {/* Quantity Controls — 44px */}
              <div className="flex items-center justify-between sm:justify-start rounded-xl border border-white/15 bg-white/5 p-1 w-full sm:w-auto">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors text-base font-semibold touch-manipulation cursor-pointer"
                >
                  -
                </button>
                <span className="w-12 sm:w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors text-base font-semibold touch-manipulation cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full">
                {/* WhatsApp Order CTA — Exact UI Design Preserved */}
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden flex-1 py-3.5 sm:py-3 px-4 sm:px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg min-h-[44px] touch-manipulation bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#B38F24] text-black hover:brightness-110 active:brightness-95 active:scale-[0.98] shadow-[#D4AF37]/10 cursor-pointer"
                >
                  <span className="shimmer-sheen" />
                  <MessageCircle className="w-4 h-4 shrink-0 relative z-10" />
                  <span className="truncate relative z-10 font-bold">Order via WhatsApp</span>
                </a>

                {/* Wishlist Button — 44px */}
                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border transition-all touch-manipulation cursor-pointer ${
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

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400 pt-3 border-t border-white/5">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> Free Insured Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> 100% Certified Authentic
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> Private Concierge Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
