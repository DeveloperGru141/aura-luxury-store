'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import Badge from './Badge';
import { Heart, Eye, MessageCircle, Star } from 'lucide-react';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { formatPrice, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const whatsappOrderUrl = getWhatsAppOrderUrl(
    product.name,
    formatPrice(product.price),
    selectedColor || product.colors[0]?.name
  );

  return (
    <div
      className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-[#13161C] border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/35 active:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/5 touch-manipulation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHovered(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHovered(false);
      }}
    >
      {/* Product Image Container — fluid */}
      <div className="relative aspect-[3/4] sm:aspect-[3/4] w-full overflow-hidden bg-[#1A1E26] cursor-pointer" onClick={handleQuickView}>
        {/* Primary Image */}
        <Image
          src={product.primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`mobile-product-primary object-cover object-center transition-all duration-700 ease-out ${
            isHovered && product.secondaryImage ? 'opacity-0 scale-105' : 'scale-100'
          }`}
        />

        {/* Secondary Image for Hover Reveal & Mobile Auto-Crossfade */}
        {product.secondaryImage && (
          <Image
            src={product.secondaryImage}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`mobile-product-secondary object-cover object-center transition-all duration-700 ease-out absolute inset-0 ${
              isHovered ? 'opacity-100 scale-105' : 'scale-100'
            }`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badge && <Badge type={product.badge} />}
        </div>

        {/* Wishlist Button — fluid 44px */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-10 p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full transition-all duration-300 backdrop-blur-md touch-manipulation ${
            isWishlisted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-black/40 text-gray-300 hover:text-white border border-white/10 hover:bg-black/70 active:bg-black/80'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform duration-300 ${isWishlisted ? 'fill-rose-400 scale-110' : ''}`} />
        </button>

        {/* Quick Action Overlay — fluid: always visible on mobile, hover on desktop */}
        <div
          className={`absolute inset-x-2.5 sm:inset-x-3 bottom-2.5 sm:bottom-3 z-10 flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:pointer-events-auto'
          }`}
        >
          <button
            onClick={handleQuickView}
            className="flex-1 py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-[#0D0F12]/90 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-medium text-gray-200 hover:text-white hover:border-[#D4AF37]/50 active:bg-[#0D0F12] transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-lg min-h-[36px] sm:min-h-[40px] touch-manipulation cursor-pointer"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] shrink-0" />
            <span>View</span>
          </button>

          {/* WhatsApp Direct Order CTA — Exact UI Design Preserved */}
          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative overflow-hidden py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-lg min-h-[36px] sm:min-h-[40px] touch-manipulation shrink-0 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black hover:brightness-110 active:brightness-95 cursor-pointer"
          >
            <span className="shimmer-sheen" />
            <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 relative z-10" />
            <span className="relative z-10">Order</span>
          </a>
        </div>
      </div>

      {/* Product Information — fluid */}
      <div className="flex flex-col p-3 sm:p-4 flex-1 justify-between gap-1">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1 sm:mb-1.5 gap-2">
            <span className="uppercase tracking-widest text-[9px] sm:text-[10px] font-semibold text-[#D4AF37] truncate">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-400 shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
              <span className="font-medium text-gray-300 text-[11px] sm:text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-[10px] hidden sm:inline">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name — fluid */}
          <h3
            onClick={handleQuickView}
            className="font-serif text-[13px] sm:text-base font-medium text-gray-100 hover:text-[#D4AF37] active:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1 mb-0.5 sm:mb-1 leading-tight"
          >
            {product.name}
          </h3>

          {/* Tagline — fluid */}
          <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-1 mb-2 sm:mb-3 leading-tight">
            {product.tagline}
          </p>
        </div>

        {/* Bottom: Color Swatches & Price (No discount strikethrough) */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto gap-2">
          {/* Color swatches */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c.name);
                }}
                className={`w-5 h-5 sm:w-3.5 sm:h-3.5 rounded-full border-2 sm:border transition-all touch-manipulation ${
                  selectedColor === c.name ? 'ring-2 ring-[#D4AF37] ring-offset-1 ring-offset-[#13161C] border-white' : 'border-white/20 hover:scale-110 active:scale-95'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Select ${c.name} color`}
              />
            ))}
          </div>

          {/* Price — Pure luxury pricing without discount badges */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span className="text-[13px] sm:text-sm font-semibold text-[#F3E5AB] tracking-tight truncate">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
