'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Search, MessageCircle } from 'lucide-react';
import type { ProductCategory } from '@/types/store';
import { getWhatsAppConciergeUrl } from '@/lib/whatsapp';

interface NavbarProps {
  onSelectCategory?: (cat: ProductCategory) => void;
}

export default function Navbar({ onSelectCategory }: NavbarProps) {
  const { setIsSearchOpen } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; href: string; category?: ProductCategory }[] = [
    { label: 'Shop', href: '#catalogue', category: 'all' },
    { label: 'Shoes', href: '#catalogue', category: 'shoes' },
    { label: 'Timepieces', href: '#catalogue', category: 'watches' },
    { label: 'Bags', href: '#catalogue', category: 'bags' },
    { label: 'Wears', href: '#catalogue', category: 'apparel' },
    { label: 'Lookbook', href: '#lookbook' },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[number]
  ) => {
    if (link.category && onSelectCategory) {
      e.preventDefault();
      onSelectCategory(link.category);
      const el = document.getElementById('catalogue');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', link.href);
      return;
    }
    if (link.href.startsWith('#')) {
      e.preventDefault();
      const id = link.href.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', link.href);
    }
  };

  const conciergeUrl = getWhatsAppConciergeUrl();

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F4F0E8]/95 backdrop-blur-xl border-b border-[#DDD6C8] shadow-sm'
          : 'bg-[#F4F0E8] border-b border-[#E7E2D6]'
      }`}
    >
      {/* TOP ROW: Perfectly Centered Brand Title with Balanced Action Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Spacer to perfectly balance the right action buttons */}
        <div className="w-16 sm:w-20" aria-hidden="true" />

        {/* Center: Grand Editorial Brand Title */}
        <div className="flex-1 text-center">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              window.history.replaceState(null, '', '#home');
            }}
            className="inline-block group cursor-pointer"
          >
            <h1 className="font-serif text-xl sm:text-3xl lg:text-5xl font-light tracking-[0.12em] sm:tracking-[0.16em] uppercase text-black group-hover:text-[#B8941F] transition-colors leading-none">
              OMO ESHO SIGNATURES
            </h1>
          </a>
        </div>

        {/* Right: Search & Concierge Icons */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 w-16 sm:w-20">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 sm:p-2 rounded-full text-black hover:bg-black/5 active:bg-black/10 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Search collection"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          </button>

          {/* Concierge Hotline */}
          <a
            href={conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-full text-black hover:bg-black/5 active:bg-black/10 transition-colors flex items-center justify-center cursor-pointer"
            title="Chat with Concierge on WhatsApp"
            aria-label="Concierge WhatsApp"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          </a>
        </div>
      </div>

      {/* DIRECT CATEGORY NAVIGATION BAR: Accessible on all devices (mobile & desktop) */}
      <div className="border-t border-[#E5DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-start sm:justify-center gap-5 sm:gap-10 overflow-x-auto scrollbar-none text-[11px] sm:text-xs tracking-[0.18em] uppercase font-medium text-stone-700">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="hover:text-black transition-colors whitespace-nowrap py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
