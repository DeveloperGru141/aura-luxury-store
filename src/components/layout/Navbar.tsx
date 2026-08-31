'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { Search, Menu, X, MessageCircle, Clock, MapPin, Phone } from 'lucide-react';
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
            <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold tracking-[0.12em] text-white group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
              <span className="truncate">OMO ESHO SIGNATURES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
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

      {/* Mobile Navigation Drawer — Framer Motion slide-over */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="lg:hidden fixed top-0 right-0 z-50 h-[100dvh] w-[88vw] max-w-[360px] bg-[#121212] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0">
                <span className="font-serif text-sm font-bold tracking-[0.15em] text-white">OMO ESHO</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-4 overscroll-contain">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className="min-h-[44px] flex items-center justify-between py-3.5 px-3 rounded-xl text-[15px] font-medium tracking-wide text-gray-200 hover:text-white hover:bg-white/5 active:bg-white/10 active:scale-[0.98] transition-all"
                    >
                      <span>{link.label}</span>
                      <span className="text-[#D4AF37] text-xs">→</span>
                    </a>
                  ))}
                </div>
              </nav>
              <div className="shrink-0 border-t border-white/10 bg-white/[0.03] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <a
                  href={conciergeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] rounded-xl bg-white text-[#121212] text-xs font-bold tracking-wide flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <MessageCircle className="h-4 w-4 text-[#9A7B2C]" />
                  <span>Chat with Ilorin atelier — under 15 mins</span>
                </a>
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-400">
                  <a href="tel:+2347065076565" className="inline-flex items-center gap-1.5 min-h-[44px] hover:text-white"><Phone className="h-3.5 w-3.5 text-[#D4AF37]" /> +234 706 507 6565</a>
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#D4AF37]" /> Mon–Sat 9am–6pm WAT</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#D4AF37]" /> Ilorin Atelier • Nationwide courier</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
