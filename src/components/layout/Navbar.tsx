'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Search, Heart, ShoppingBag, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const {
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Bags & Leather', href: '#categories' },
    { label: 'Haute Couture', href: '#categories' },
    { label: 'Timepieces', href: '#categories' },
    { label: 'Fine Jewelry', href: '#categories' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'VIP Drop', href: '#flash-drop' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D0F14]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-[#0D0F14]/60 backdrop-blur-md border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <a href="#" className="flex flex-col group">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-white group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
              <span>AURA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            </span>
            <span className="text-[8px] uppercase tracking-[0.35em] text-gray-400 font-sans -mt-1 group-hover:text-gray-200 transition-colors">
              Maison de Luxe
            </span>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium uppercase tracking-wider text-gray-300 hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions (Search, Wishlist, Bag) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 group border border-transparent hover:border-white/10"
            aria-label="Search catalogue"
          >
            <Search className="w-4 h-4 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
            <span className="hidden md:inline text-xs text-gray-400 group-hover:text-gray-200">Search</span>
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 sm:p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            aria-label="Saved wishlist"
          >
            <Heart className="w-4 h-4 text-gray-300 hover:text-rose-400 transition-colors" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-scale-in">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#F3E5AB] transition-all hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/5"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-semibold hidden sm:inline">Bag</span>
            <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center -mr-1">
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0D0F14]/98 backdrop-blur-2xl px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium tracking-wide text-gray-200 hover:text-[#D4AF37] transition-colors py-1 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-[#D4AF37] text-xs">&rarr;</span>
              </a>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <a
                href="#vip"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Join VIP Atelier</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
