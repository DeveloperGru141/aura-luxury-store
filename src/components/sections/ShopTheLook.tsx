'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { Sparkles, Eye, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';
import { useLiveProducts } from '@/hooks/useLiveProducts';

export default function ShopTheLook() {
  const { setQuickViewProduct, formatPrice } = useStore();
  const { products: liveProducts } = useLiveProducts();
  const shouldReduceMotion = useReducedMotion();

  const stylingSlides = React.useMemo(() => {
    if (liveProducts.length === 0) return [];
    const shuffled = [...liveProducts].sort(() => 0.5 - Math.random()).slice(0, 6);
    return shuffled.map((p: any) => ({
      id: `look-${p.id}`,
      productId: p.id,
      title: p.name,
      description: (p.description ?? p.tagline ?? '').slice(0, 80),
      category: p.categoryLabel ?? p.categories?.name ?? p.category,
      image: p.primaryImage ?? p.images?.[0] ?? '',
    }));
  }, [liveProducts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (stylingSlides.length === 0) return;
    if (isPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timerRef.current = setInterval(() => {
      if (document.hidden) return;
      setCurrentIndex((prev) => (prev + 1) % stylingSlides.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stylingSlides.length, isPaused]);

  useEffect(() => {
    if (currentIndex >= stylingSlides.length && stylingSlides.length > 0) setCurrentIndex(0);
  }, [stylingSlides.length, currentIndex]);

  const currentSlide = stylingSlides.length > 0 ? stylingSlides[currentIndex % stylingSlides.length] : null;
  const activeProduct = currentSlide ? (liveProducts.find((p) => p.id === currentSlide.productId) || liveProducts[0] as any) : null;

  const handlePrev = () => {
    if (stylingSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + stylingSlides.length) % stylingSlides.length);
  };

  const handleNext = () => {
    if (stylingSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % stylingSlides.length);
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { setTouchStartX(e.touches[0].clientX); };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) { if (diff > 0) handleNext(); else handlePrev(); }
    setTouchStartX(null);
  };

  const whatsappOrderUrl = activeProduct ? getWhatsAppOrderUrl(activeProduct.name, formatPrice(Number(activeProduct.price))) : '#';

  if (stylingSlides.length === 0) {
    return (
      <section id="lookbook" className="py-10 sm:py-14 lg:py-16 bg-[var(--color-surface-alt)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col mb-6 sm:mb-8">
          <h2 className="font-sans text-[22px] sm:text-[28px] lg:text-[30px] font-extrabold tracking-tight uppercase text-[var(--color-text-primary)] leading-tight">Curated lookbook</h2>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-10 sm:p-14 text-center shadow-sm">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4"><Sparkles className="w-7 h-7 text-[var(--color-accent-gold)]" /></div>
            <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">Lookbook coming soon</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">Add products in the admin dashboard to populate the curated showcase.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lookbook" className="py-10 sm:py-14 lg:py-16 bg-[var(--color-surface-alt)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col mb-6 sm:mb-8"
        >
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C43] mb-1">
            Visual Atelier
          </p>
          <h2 className="font-serif text-[22px] sm:text-[28px] lg:text-[30px] font-light tracking-wide uppercase text-[var(--color-text-primary)] leading-tight">
            Curated Lookbook
          </h2>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-6 items-start"
        >
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white group min-h-[280px] sm:min-h-[360px] touch-pan-y shadow-sm"
          >
            {stylingSlides.map((slide, idx) => {
              const isActive = currentIndex === idx;
              return (
                <div key={slide.id} className={`absolute inset-0 bg-[#F5F1E8] flex items-center justify-center p-4 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <div className="relative w-full h-full max-w-[88%] max-h-[88%]">
                    <Image src={slide.image} alt={slide.title} fill priority={idx === 0} className="object-contain" sizes="65vw" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              );
            })}

            <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold)] shadow-md active:scale-95 transition-all" aria-label="Previous look"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold)] shadow-md active:scale-95 transition-all" aria-label="Next look"><ChevronRight className="w-4 h-4" /></button>

            {currentSlide && (
              <div className="absolute bottom-4 sm:bottom-5 inset-x-4 sm:inset-x-5 z-20 hidden sm:block pointer-events-none">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 block mb-1">{currentSlide.category}</span>
                <h3 className="font-serif text-xl lg:text-2xl font-light text-white line-clamp-1">{currentSlide.title}</h3>
              </div>
            )}

            <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex justify-center items-center gap-2">
              {stylingSlides.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-7 bg-[var(--color-accent-gold)]' : 'w-2 bg-white/60 hover:bg-white'}`} aria-label={`Go to look ${idx + 1}`} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            {activeProduct && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-gold)]">
                      <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-gold)] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent-gold)]" /></span>
                      <span>{(activeProduct as any).categoryLabel ?? (activeProduct as any).categories?.name ?? ''}</span>
                    </span>
                    <span className={`font-medium text-[11px] px-2 py-1 rounded-full border ${((activeProduct as any).stock_status === 'out_of_stock' || (activeProduct as any).inStock === false) ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>{(activeProduct as any).stock_status === 'out_of_stock' || (activeProduct as any).inStock === false ? 'Out of Stock' : 'In Stock'}</span>
                  </div>
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[var(--color-surface-alt)] mb-4 border border-[var(--color-border)]">
                    <Image src={(activeProduct as any).primaryImage ?? (activeProduct as any).images?.[0] ?? ''} alt={activeProduct.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-medium text-base text-[var(--color-text-primary)] mb-1">{activeProduct.name}</h3>
                  <p className="text-xs text-[var(--color-text-tertiary)] line-clamp-2 mb-4 leading-relaxed">{activeProduct.description}</p>
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-[var(--color-border)]">
                    <span className="text-xs text-[var(--color-text-tertiary)]">Price</span><span className="text-lg font-bold text-[var(--color-text-primary)]">{formatPrice(Number(activeProduct.price))}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setQuickViewProduct(activeProduct)} className="py-2.5 px-3 rounded-full bg-white border border-[var(--color-border)] hover:border-[var(--color-text-primary)] text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all flex items-center justify-center gap-1.5 min-h-[40px]"><Eye className="w-3.5 h-3.5" /><span>Quick View</span></button>
                    <a href={whatsappOrderUrl} target="_blank" rel="noopener noreferrer" className="py-2.5 px-3 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] active:scale-[0.97] text-black text-xs font-semibold transition-all flex items-center justify-center gap-1.5 min-h-[40px] shadow-sm"><MessageCircle className="w-3.5 h-3.5" /><span>Order</span></a>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-semibold block px-2 mb-1">Curated Transitions ({stylingSlides.length} Items)</span>
              {stylingSlides.map((slide, idx) => {
                const isSelected = currentIndex === idx;
                const prod = liveProducts.find((p) => p.id === slide.productId);
                return (
                  <button key={slide.id} onClick={() => setCurrentIndex(idx)} className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between text-xs ${isSelected ? 'bg-[var(--color-accent-gold-light)] border border-[var(--color-accent-gold)] text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] border border-transparent'}`}>
                    <span className="truncate">{slide.title}</span>
                    {prod && <span className="text-[11px] font-semibold text-[var(--color-text-primary)] shrink-0 ml-2">{formatPrice(Number(prod.price))}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
