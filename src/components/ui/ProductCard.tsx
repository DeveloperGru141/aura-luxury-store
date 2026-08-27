'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import Badge from './Badge';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { formatPrice, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-[#13161C] border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/30 hover:shadow-2xl hover:shadow-[#D4AF37]/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1A1E26] cursor-pointer" onClick={handleQuickView}>
        {/* Primary Image */}
        <Image
          src={product.primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover object-center transition-all duration-700 ease-out ${
            isHovered && product.secondaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

        {/* Secondary Image for Hover Reveal */}
        {product.secondaryImage && (
          <Image
            src={product.secondaryImage}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover object-center transition-all duration-700 ease-out absolute inset-0 ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badge && <Badge type={product.badge} />}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-300 backdrop-blur-md ${
            isWishlisted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-black/40 text-gray-300 hover:text-white border border-white/10 hover:bg-black/70'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform duration-300 ${isWishlisted ? 'fill-rose-400 scale-110' : ''}`} />
        </button>

        {/* Quick Action Overlay (Slide-up on hover) */}
        <div
          className={`absolute inset-x-3 bottom-3 z-10 flex items-center gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <button
            onClick={handleQuickView}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0D0F12]/90 backdrop-blur-md border border-white/10 text-xs font-medium text-gray-200 hover:text-white hover:border-[#D4AF37]/50 transition-all flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={justAdded}
            className={`py-2.5 px-4 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black hover:brightness-110'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col p-4 flex-1 justify-between">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span className="uppercase tracking-widest text-[10px] font-semibold text-[#D4AF37]">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-medium text-gray-300 text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={handleQuickView}
            className="font-serif text-base font-medium text-gray-100 hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-gray-400 line-clamp-1 mb-3">
            {product.tagline}
          </p>
        </div>

        {/* Bottom: Color Swatches & Price */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          {/* Color swatches */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c.name);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor === c.name ? 'ring-2 ring-[#D4AF37] ring-offset-1 ring-offset-[#13161C]' : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Select ${c.name} color`}
              />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-sm font-semibold text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
