'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Search, Menu, X, Sparkles, MessageCircle } from 'lucide-react';
import type { ProductCategory } from '@/types/store';
import { getWhatsAppConciergeUrl } from '@/lib/whatsapp';

interface NavbarProps {
  onSelectCategory?: (cat: ProductCategory) => void;
}

export default function Navbar({ onSelectCategory }: NavbarProps) {
  const { setIsSearchOpen } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);
      // Hide on scroll-down, reveal on scroll-up — only on small viewports, respect reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsHidden(false);
      } else if (!isMobileMenuOpen) {
        if (currentY > 120 && currentY > lastScrollY.current) setIsHidden(true);
        else if (currentY < lastScrollY.current) setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Exact navigation routes mapped to sections & categories
  const navLinks: { label: string; href: string; category?: ProductCategory }[] = [
    { label: 'Bags', href: '#catalogue', category: 'bags' },
    { label: 'Wears', href: '#catalogue', category: 'apparel' },
    { label: 'Shoes', href: '#catalogue', category: 'shoes' },
    { label: 'Wristwatches', href: '#catalogue', category: 'watches' },
    { label: 'Jewelry', href: '#catalogue', category: 'jewelry' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'Reviews', href: '#reviews' },
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
      setIsMobileMenuOpen(false);
      window.history.replaceState(null, '', link.href);
      return;
    }
    if (link.href.startsWith('#')) {
      e.preventDefault();
      const id = link.href.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', link.href);
      setIsMobileMenuOpen(false);
    }
    if (!link.href.startsWith('#')) setIsMobileMenuOpen(false);
  };

  const conciergeUrl = getWhatsAppConciergeUrl();

  return (
    <header
      className={`sticky top-0 z-40 transition-[transform,background-color,border-color,padding] duration-300 will-change-transform ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${isScrolled ? 'bg-[#0D0F14]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5' : 'bg-[#0D0F14]/70 backdrop-blur-md border-b border-white/5 py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center justify-center touch-manipulation cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo — routes to hero */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              window.history.replaceState(null, '', '#home');
            }}
            className="flex flex-col group cursor-pointer"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.15em] text-white group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
              <span>OMO ESHO SIGNATURES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            </span>
            <span className="text-[8px] tracking-[0.12em] text-gray-400 font-sans -mt-0.5 group-hover:text-gray-200 transition-colors">
              Ilorin — small runs, made to order
            </span>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="text-[11px] xl:text-xs font-medium uppercase tracking-wider text-gray-300 hover:text-[#D4AF37] transition-colors relative py-2 touch-manipulation after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Search & Direct WhatsApp Concierge CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger — 44px min hit target */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="min-h-[44px] min-w-[44px] p-2.5 sm:p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center justify-center gap-2 group border border-transparent hover:border-white/10 touch-manipulation cursor-pointer"
            aria-label="Search catalogue"
          >
            <Search className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
            <span className="hidden md:inline text-xs text-gray-400 group-hover:text-gray-200">Search</span>
          </button>

          {/* Human concierge — Ilorin atelier */}
          <a
            href={conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex flex-col items-start px-3.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8DDD0] hover:border-[#C5A059]/40 text-[#121212] transition-all shadow-sm touch-manipulation"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold"><MessageCircle className="w-3.5 h-3.5 text-[#9A7B2C]" /> Chat with Ilorin atelier</span>
            <span className="text-[10px] text-[#8A7F72]">typical response under 15 mins</span>
          </a>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0D0F14]/98 backdrop-blur-2xl px-4 sm:px-6 py-5 sm:py-6 animate-slide-down max-h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))] touch-manipulation">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="text-[15px] font-medium tracking-wide text-gray-200 hover:text-[#D4AF37] active:text-[#D4AF37] transition-colors py-3.5 min-h-[44px] flex items-center justify-between touch-manipulation"
              >
                <span>{link.label}</span>
                <span className="text-[#D4AF37] text-xs">&rarr;</span>
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
              <a
                href={conciergeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98] transition-transform"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Concierge</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
