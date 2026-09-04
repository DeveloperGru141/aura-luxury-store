'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { Eye, MessageCircle } from 'lucide-react';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { formatPrice, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState((product as any).colors?.[0]?.name || '');
  const [isOpeningWhatsApp, setIsOpeningWhatsApp] = useState(false);

  const anyProduct: any = product as any;
  const stockStatus: 'in_stock' | 'out_of_stock' | undefined = anyProduct.stock_status;
  const isOutOfStock = stockStatus === 'out_of_stock' || anyProduct.inStock === false;
  const primaryImg: string = anyProduct.primaryImage ?? anyProduct.images?.[0] ?? '';

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const whatsappOrderUrl = getWhatsAppOrderUrl(
    product.name,
    formatPrice(Number(product.price)),
    selectedColor || (product as any).colors?.[0]?.name
  );

  return (
    <div
      className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-white border border-[var(--color-border)] overflow-hidden transition-[transform,border-color,box-shadow] duration-200 hover:border-[var(--color-accent-gold)]/30 hover:shadow-[var(--shadow-elev-2)] active:scale-[0.98] touch-manipulation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHovered(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHovered(false);
      }}
    >
      {/* Product Image Container — single image, no shimmer */}
      <div className="relative aspect-[1/1] w-full overflow-hidden bg-[var(--color-surface-alt)] cursor-pointer" onClick={handleQuickView}>
        <Image
          src={primaryImg}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] shadow-sm">
            Out of Stock
          </div>
        )}

        <div
          className={`absolute inset-x-2.5 sm:inset-x-3 bottom-2.5 sm:bottom-3 z-10 flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-2 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:pointer-events-auto'
          }`}
        >
          <button
            onClick={handleQuickView}
            className="flex-1 py-2.5 px-2 sm:px-3 rounded-full bg-white border border-[var(--color-border)] text-[11px] sm:text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] active:scale-[0.97] transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm min-h-[36px] sm:min-h-[40px] touch-manipulation cursor-pointer"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>View</span>
          </button>

          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpeningWhatsApp(true);
              setTimeout(() => setIsOpeningWhatsApp(false), 1400);
            }}
            className="py-2.5 px-3 sm:px-4 rounded-full font-semibold text-[11px] sm:text-xs transition-[transform,background-color] duration-150 flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm min-h-[36px] sm:min-h-[40px] touch-manipulation shrink-0 bg-black hover:bg-zinc-900 text-white active:scale-[0.97] cursor-pointer"
          >
            <MessageCircle className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-150 ${isOpeningWhatsApp ? 'animate-pulse' : ''}`} />
            <span>{isOpeningWhatsApp ? 'Opening…' : 'Order'}</span>
          </a>
        </div>
      </div>

      {/* Product Information — compact on mobile to reduce cramping */}
      <div className="flex flex-col p-2.5 sm:p-3 lg:p-4 flex-1 justify-between gap-1">
        <div>
          <h3
            onClick={handleQuickView}
            className="font-medium text-[11px] sm:text-[13px] lg:text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] active:text-[var(--color-accent-gold)] transition-colors cursor-pointer line-clamp-1 mb-0.5 leading-tight"
          >
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-[var(--color-text-tertiary)] line-clamp-1 leading-tight">
            {(product as any).tagline ?? (anyProduct.description ? String(anyProduct.description).slice(0, 60) : '')}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] mt-1.5 gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {((product as any).colors as any[])?.map((c: any) => (
              <button
                key={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c.name);
                }}
                className={`w-4 h-4 sm:w-4 sm:h-4 rounded-full border-2 transition-all touch-manipulation ${
                  selectedColor === c.name ? 'ring-2 ring-[var(--color-accent-gold)] ring-offset-1 sm:ring-offset-2 ring-offset-white border-white' : 'border-[var(--color-border)] hover:scale-110 active:scale-95'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Select ${c.name} color`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span className="text-[11px] sm:text-sm font-bold text-[var(--color-text-primary)] tracking-tight truncate">
              {formatPrice(Number(product.price))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
