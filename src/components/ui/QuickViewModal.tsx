'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, formatPrice } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

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
    quantity,
    typeof window !== 'undefined' ? `${window.location.origin}/product/${quickViewProduct.slug}` : undefined
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-4xl bg-white border border-[var(--color-border)] rounded-t-2xl sm:rounded-3xl shadow-xl overflow-hidden z-10 max-h-[92dvh] sm:max-h-[92vh] flex flex-col md:flex-row animate-slide-up sm:animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] shadow-sm transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-[var(--color-surface-alt)] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[var(--color-border)]">
          <div className="relative aspect-[3/4] sm:aspect-square w-full rounded-xl overflow-hidden bg-white border border-[var(--color-border)] mb-3 sm:mb-4 shadow-sm">
            <Image
              src={images[selectedImageIndex] || quickViewProduct.primaryImage}
              alt={quickViewProduct.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-all duration-500"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[var(--color-accent-gold)] shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-[var(--color-border)]'
                  }`}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="uppercase tracking-widest text-[10px] font-bold text-[var(--color-accent-gold)]">
                {quickViewProduct.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-[var(--color-text-primary)]">{quickViewProduct.rating.toFixed(1)}</span>
                <span className="text-[var(--color-text-tertiary)]">({quickViewProduct.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-[var(--color-text-primary)] mb-2 leading-tight">
              {quickViewProduct.name}
            </h2>

            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-light mb-4">
              {quickViewProduct.tagline}
            </p>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                {formatPrice(quickViewProduct.price)}
              </span>
            </div>

            <p className="text-xs text-[var(--color-text-tertiary)] font-light leading-relaxed mb-6 border-y border-[var(--color-border)] py-3">
              {quickViewProduct.description}
            </p>

            {quickViewProduct.colors.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                  <span>Selected Finish: <strong className="text-[var(--color-text-primary)]">{activeColor}</strong></span>
                </div>
                <div className="flex gap-2.5">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-full border text-xs transition-all cursor-pointer ${
                        activeColor === c.name
                          ? 'border-[var(--color-accent-gold)] bg-[var(--color-accent-gold-light)] text-[var(--color-text-primary)] font-medium'
                          : 'border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-[var(--color-border)]"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                  <span>Select Size</span>
                  <span className="text-[var(--color-accent-gold)] cursor-pointer hover:underline text-[11px]">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                        activeSize === s
                          ? 'border-[var(--color-accent-gold)] bg-black text-white font-semibold shadow-sm'
                          : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 p-3.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-xs mb-6">
              {quickViewProduct.specs.slice(0, 2).map((spec, idx) => (
                <div key={idx}>
                  <span className="text-[var(--color-text-tertiary)] block text-[11px]">{spec.label}</span>
                  <span className="text-[var(--color-text-primary)] font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <div className="flex items-center justify-between sm:justify-start rounded-full border border-[var(--color-border)] bg-white p-1 w-full sm:w-auto shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] rounded-full transition-colors text-base font-semibold cursor-pointer"
                >
                  -
                </button>
                <span className="w-12 sm:w-9 text-center text-sm font-semibold text-[var(--color-text-primary)]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] rounded-full transition-colors text-base font-semibold cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 sm:py-3 px-4 sm:px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm min-h-[44px] bg-black hover:bg-zinc-900 active:scale-[0.97] text-white cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span className="truncate font-bold">Order via WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--color-text-tertiary)] pt-3 border-t border-[var(--color-border)]">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[var(--color-accent-gold)] shrink-0" /> Free Insured Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent-gold)] shrink-0" /> 100% Certified Authentic
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-[var(--color-accent-gold)] shrink-0" /> Private Concierge Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
