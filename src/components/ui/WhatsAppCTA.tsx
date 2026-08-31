'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppOrderUrl, getWhatsAppConciergeUrl } from '@/lib/whatsapp';

interface WhatsAppCTAProps {
  productName?: string;
  priceStr?: string;
  color?: string;
  size?: string;
  quantity?: number;
  label?: string;
  sizeVariant?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function WhatsAppCTA({
  productName,
  priceStr,
  color,
  size,
  quantity,
  label = 'Order on WhatsApp',
  sizeVariant = 'md',
  fullWidth = false,
  className = '',
}: WhatsAppCTAProps) {
  const href = productName
    ? getWhatsAppOrderUrl(productName, priceStr, color, size, quantity)
    : getWhatsAppConciergeUrl();

  const sizeClasses = {
    sm: 'py-2 px-3 text-[11px]',
    md: 'py-2.5 px-4 text-xs',
    lg: 'py-3.5 px-6 text-sm',
  }[sizeVariant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-[#8C7A5B] via-[#E2C366] to-[#B38F24] text-black font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:brightness-110 active:brightness-95 active:scale-[0.98] shadow-lg min-h-[40px] touch-manipulation group ${sizeClasses} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="shimmer-sheen" />
      <MessageCircle className="w-4 h-4 shrink-0 relative z-10" />
      <span className="relative z-10">{label}</span>
    </a>
  );
}
