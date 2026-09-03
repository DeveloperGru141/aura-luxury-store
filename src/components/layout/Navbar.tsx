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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);
      // Static on mobile — never hide, no scroll-away
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsHidden(false);
        lastScrollY.current = currentY;
        return;
      }
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

  const navLinks: { label: string; href: string; category?: ProductCategory }[] = [
    { label: 'Bags', href: '#catalogue', category: 'bags' },
    { label: 'Wears', href: '#catalogue', category: 'apparel' },
    { label: 'Shoes', href: '#catalogue', category: 'shoes' },
    { label: 'Wristwatches', href: '#catalogue', category: 'watches' },
    { label: 'Jewelry', href: '#catalogue', category: 'jewelry' },
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
      className={`static lg:sticky lg:top-0 z-40 transition-[background-color,border-color,padding] duration-300 lg:transition-[transform,background-color,border-color,padding] will-change-transform ${
        isHidden ? 'lg:-translate-y-full translate-y-0' : 'translate-y-0'
      } ${isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-[var(--color-border)] shadow-sm py-3.5' : 'bg-white/80 backdrop-blur-md border-b border-[var(--color-border)] py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl hover:bg-[var(--color-surface-alt)] active:bg-[var(--color-border)] transition-colors flex flex-col items-start justify-center gap-1.5 touch-manipulation cursor-pointer group"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`block h-[2px] rounded-full bg-[var(--color-text-primary)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'}`} />
            <span className={`block h-[2px] rounded-full bg-[var(--color-text-primary)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'w-6 opacity-0' : 'w-4'}`} />
            <span className={`block h-[2px] rounded-full bg-[var(--color-text-primary)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-3'}`} />
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
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.28em] text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold)] transition-colors flex items-center gap-1.5">
              <span>OMO ESHO SIGNATURES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-gold)]" />
            </span>
            <span className="text-[8px] tracking-[0.2em] text-[var(--color-text-tertiary)] font-sans -mt-0.5 group-hover:text-[var(--color-text-secondary)] transition-colors">
              ILORIN — worldwide insured courier
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
              className="text-[11px] xl:text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-accent-gold)] transition-colors relative py-2 touch-manipulation after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[var(--color-accent-gold)] hover:after:w-full after:transition-all after:duration-300"
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
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] active:bg-[var(--color-border)] transition-colors flex items-center justify-center gap-2 group border border-transparent hover:border-[var(--color-border)] touch-manipulation cursor-pointer"
            aria-label="Search catalogue"
          >
            <Search className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-gold)] transition-colors" />
            <span className="hidden md:inline text-xs text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]">Search</span>
          </button>

          {/* Concierge WhatsApp button — pill */}
          <a
            href={conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] active:scale-[0.97] text-black text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow-md touch-manipulation"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Concierge</span>
          </a>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-white px-4 sm:px-6 py-5 sm:py-6 animate-slide-down max-h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))] touch-manipulation shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="text-[15px] font-medium tracking-wide text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] active:text-[var(--color-accent-gold)] transition-colors py-3.5 min-h-[44px] flex items-center justify-between touch-manipulation"
              >
                <span>{link.label}</span>
                <span className="text-[var(--color-accent-gold)] text-xs">&rarr;</span>
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-[var(--color-border)] flex flex-col gap-3">
              <a
                href={conciergeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 min-h-[44px] rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] text-black text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98] transition-transform shadow-sm"
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
