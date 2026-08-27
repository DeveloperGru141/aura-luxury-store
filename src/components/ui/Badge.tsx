import React from 'react';
import { ProductBadge } from '@/types/store';

interface BadgeProps {
  type: ProductBadge;
}

export default function Badge({ type }: BadgeProps) {
  const badgeStyles: Record<ProductBadge, { bg: string; text: string; label: string }> = {
    NEW: {
      bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
      text: 'New Arrival',
      label: 'NEW',
    },
    LIMITED: {
      bg: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
      text: 'Limited Edition',
      label: 'LIMITED',
    },
    BESTSELLER: {
      bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
      text: 'Bestseller',
      label: 'BESTSELLER',
    },
    EXCLUSIVE: {
      bg: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
      text: 'Maison Exclusive',
      label: 'EXCLUSIVE',
    },
    SALE: {
      bg: 'bg-red-950/80 border-red-500/40 text-red-300',
      text: 'Special Offer',
      label: 'SALE',
    },
    TRENDING: {
      bg: 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300',
      text: 'Trending Runway',
      label: 'TRENDING',
    },
  };

  const current = badgeStyles[type] || badgeStyles.NEW;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border backdrop-blur-md ${current.bg}`}
    >
      {current.label}
    </span>
  );
}
