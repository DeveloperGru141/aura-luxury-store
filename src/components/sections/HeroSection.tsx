'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLiveProducts } from '@/hooks/useLiveProducts';

export default function HeroSection() {
  const { setQuickViewProduct, formatPrice } = useStore();
  const { products: liveProducts } = useLiveProducts();

  const heroSlides = React.useMemo(() => {
    if (liveProducts.length === 0) return [];
    const shuffled = [...liveProducts].sort(() => 0.5 - Math.random()).slice(0, 5);
    return shuffled.map((p: any) => ({
      id: `slide-${p.id}`,
      productId: p.id,
      title: p.name,
      subtitle: (p.tagline ?? p.description ?? '').slice(0, 60),
      category: p.categoryLabel ?? p.categories?.name ?? p.category,
      image: p.heroImage ?? p.primaryImage ?? p.images?.[0] ?? '',
      price: p.price,
    }));
  }, [liveProducts]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (heroSlides.length === 0) return;
    if (isPaused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timerRef.current = setInterval(() => {
      if (document.hidden) return;
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [heroSlides.length, isPaused]);

  useEffect(() => {
    if (currentSlideIndex >= heroSlides.length && heroSlides.length > 0) setCurrentSlideIndex(0);
  }, [heroSlides.length, currentSlideIndex]);

  const currentSlide = heroSlides.length > 0 ? heroSlides[currentSlideIndex % heroSlides.length] : null;
  const activeProduct = currentSlide ? (liveProducts.find((p) => p.id === currentSlide.productId) || liveProducts[0] as any) : null;

  const handleNext = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    resetTimer();
  };

  const handlePrev = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    resetTimer();
  };

  const handleDotClick = (idx: number) => {
    setCurrentSlideIndex(idx);
    resetTimer();
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStartX(null);
  };

  const hasHeroData = heroSlides.length > 0;
  const heroImageSrc = (activeProduct as any)?.heroImage ?? currentSlide?.image ?? '';

  // Scroll parallax — efficient, transform only, disabled on coarser / reduced-motion
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -18]);

  return (
    <section ref={heroRef} id="home" className="relative overflow-hidden bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Mobile: side-by-side text + carousel (52/48) - re-themed to light, structure intact */}
        <div className="flex gap-3 items-start lg:hidden py-6 sm:py-8">
          {/* Left column — text only */}
          <div className="w-[52%] min-w-0">
            <p className="text-[11px] font-medium tracking-wide text-[var(--color-accent-gold)] leading-tight">Based in Ilorin — genuine leather, silk & Swiss-sourced timepieces</p>
            <h1 className="font-serif text-[22px] leading-tight font-light text-[var(--color-text-primary)] tracking-tight mt-1.5">
              Genuine pieces, <em className="italic font-normal text-[var(--color-accent-gold)]">curated from Ilorin.</em>
            </h1>
            <p className="text-[12px] text-[var(--color-text-tertiary)] font-light mt-2 leading-snug">Timepieces, sourced from Switzerland.</p>
          </div>

          {/* Right column — single-card carousel */}
          <div className="w-[48%] min-w-0">
            {!hasHeroData ? (
              <div className="aspect-[4/5] rounded-2xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex flex-col items-center justify-center p-4 text-center">
                <p className="text-xs font-medium text-[var(--color-text-primary)]">Next drop soon</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Join waitlist on WhatsApp</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-[var(--color-border)] bg-[var(--color-surface-alt)] touch-pan-y shadow-sm" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                {heroSlides.map((slide, idx) => {
                  const isActive = currentSlideIndex === idx;
                  const product = liveProducts.find((p) => p.id === slide.productId);
                  return (
                    <div key={slide.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                      <Image src={slide.image} alt={slide.title} fill className="object-cover" sizes="48vw" priority={idx === 0} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-2.5 flex items-end justify-between gap-1.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-gold)] shrink-0" />
                            <span className="text-amber-100 text-[9px] tracking-wide uppercase truncate">{slide.category}</span>
                          </div>
                          <p className="text-white text-xs font-medium truncate leading-tight">{slide.title}</p>
                          <p className="text-amber-200 text-[11px] font-medium">{product ? formatPrice(Number(product.price)) : ''}</p>
                        </div>
                        <button onClick={() => product && setQuickViewProduct(product)} aria-label={`View ${slide.title}`} className="shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform shadow-md">
                          <ArrowRight className="w-3 h-3 text-black" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="absolute top-2 inset-x-0 flex justify-center gap-1 z-10">
                  {heroSlides.map((_, idx) => (
                    <button key={idx} onClick={() => handleDotClick(idx)} className={`h-1 rounded-full transition-all ${currentSlideIndex === idx ? 'w-4 bg-[var(--color-accent-gold)]' : 'w-1 bg-white/60'}`} aria-label={`Go to slide ${idx + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile full-width below two-column row */}
        <div className="lg:hidden pb-8">
          <p className="text-[13px] text-[var(--color-text-secondary)] font-light leading-relaxed">
            Every piece we carry is genuine — leather bags, silk wears, hand-selected shoes from Marche, and watches sourced direct from Swiss makers. We're based in Ilorin, where every order is inspected before it ships — with insured courier delivery, worldwide.
          </p>
          <div className="flex flex-col gap-3 mt-4">
            <a href="#catalogue" className="py-3.5 px-6 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] active:scale-[0.98] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 min-h-[44px] shadow-sm hover:shadow-md transition-all">
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
            <a href="#lookbook" className="py-3.5 px-5 rounded-full bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-primary)] font-medium text-xs uppercase tracking-widest text-center min-h-[44px] flex items-center justify-center gap-2 transition-all">
              <span>View Lookbook</span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-5 mt-4 border-t border-[var(--color-border)] text-left">
            <div>
              <div className="flex items-center gap-1.5 text-[var(--color-text-primary)] font-serif text-xs font-bold tracking-wide">
                <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-gold)] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent-gold)]" /></span>
                <span>100% GENUINE</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[var(--color-text-primary)] font-serif text-xs font-bold tracking-wide">
                <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-gold)] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent-gold)]" /></span>
                <span>WORLDWIDE INSURED DELIVERY</span>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP HERO — 35/65 two-column, pill CTA, floating card, numbered + thumbnail rail */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-10 items-center py-10 xl:py-14">
          {/* Left column ~35% — scroll reveal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 xl:col-span-4 flex flex-col items-start text-left w-full min-w-0 pr-2 xl:pr-6"
          >
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--color-accent-gold)] mb-3">Based in Ilorin — genuine leather, silk & Swiss-sourced timepieces</p>
            <h1 className="font-serif text-[42px] xl:text-[48px] font-light text-[var(--color-text-primary)] tracking-tight leading-[0.95] mb-3">
              Genuine pieces,<br />
              <span className="italic font-normal text-[var(--color-accent-gold)]">curated from Ilorin.</span>
            </h1>
            <p className="text-[15px] font-normal text-[var(--color-text-tertiary)] leading-snug mb-4">Timepieces, sourced from Switzerland.</p>
            <p className="text-[14px] text-[var(--color-text-secondary)] max-w-[38ch] font-light leading-relaxed mb-7">
              Every piece we carry is genuine — leather bags, silk wears, hand-selected shoes from Marche, and watches sourced direct from Swiss makers. We're based in Ilorin, where every order is inspected before it ships — with insured courier delivery, worldwide.
            </p>
            <div className="flex items-center gap-3 mb-7">
              <a href="#catalogue" className="py-3.5 px-7 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] active:scale-[0.98] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all min-h-[44px]">
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
              <a href="#lookbook" className="py-3.5 px-6 rounded-full bg-white border border-[var(--color-border)] hover:border-[var(--color-text-primary)] text-[var(--color-text-primary)] font-medium text-xs uppercase tracking-widest text-center min-h-[44px] flex items-center justify-center transition-all">
                View Lookbook
              </a>
            </div>
            <div className="flex items-center gap-6 pt-5 border-t border-[var(--color-border)] w-full max-w-sm text-left">
              <div className="flex items-center gap-1.5 text-[var(--color-text-primary)] font-sans text-[11px] font-bold tracking-widest">
                <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-gold)] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent-gold)]" /></span>
                <span>100% GENUINE</span>
              </div>
              <span className="w-px h-3 bg-[var(--color-border)]" />
              <div className="flex items-center gap-1.5 text-[var(--color-text-primary)] font-sans text-[11px] font-bold tracking-widest">
                <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-gold)] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent-gold)]" /></span>
                <span>WORLDWIDE INSURED DELIVERY</span>
              </div>
            </div>
          </motion.div>

          {/* Right column ~65% - large product image area — scroll parallax */}
          <div className="lg:col-span-7 xl:col-span-8 relative w-full min-w-0">
            <motion.div
              style={isReduced ? undefined : { scale: imageScale, y: imageY }}
              className="will-change-transform"
            >
              <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative aspect-[16/10] xl:aspect-[16/9] min-h-[420px] xl:min-h-[520px] w-full rounded-[1.5rem] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-alt)] group touch-pan-y shadow-[var(--shadow-elev-2)]"
              >
              {heroSlides.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-surface-alt)] p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--color-border)] flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="w-7 h-7 text-[var(--color-accent-gold)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">Curated collection coming soon</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] max-w-xs">Add products in the admin dashboard to populate the hero showcase.</p>
                </div>
              ) : (
                <>
                  {heroSlides.map((slide, idx) => {
                    const isActive = currentSlideIndex === idx;
                    return (
                      <div key={slide.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                        <Image src={slide.image} alt={slide.title} fill priority={idx === 0} className={`object-cover object-center ${isActive ? 'animate-hero-drift' : ''}`} sizes="65vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                      </div>
                    );
                  })}
                  {/* Prev/next circular - white/cream, black or gold icon */}
                  <button onClick={handlePrev} className="absolute left-4 xl:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] hover:border-[var(--color-accent-gold)] shadow-md hover:shadow-lg active:scale-95 transition-all" aria-label="Previous slide">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleNext} className="absolute right-4 xl:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] hover:border-[var(--color-accent-gold)] shadow-md hover:shadow-lg active:scale-95 transition-all" aria-label="Next slide">
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Floating card - bottom corner */}
                  {activeProduct && (
                    <div onClick={() => setQuickViewProduct(activeProduct)} className="absolute bottom-4 xl:bottom-5 left-4 xl:left-5 z-20 p-3.5 xl:p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-[var(--shadow-elev-2)] cursor-pointer hover:border-[var(--color-accent-gold)] active:scale-[0.98] transition-all flex items-center gap-3 max-w-[320px] xl:max-w-[360px]">
                      <div className="relative w-14 h-14 xl:w-16 xl:h-16 rounded-xl overflow-hidden bg-[var(--color-surface-alt)] shrink-0 border border-[var(--color-border)]">
                        <Image src={(activeProduct as any).heroImage ?? (activeProduct as any).primaryImage ?? (activeProduct as any).images?.[0] ?? ''} alt={activeProduct.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[var(--color-accent-gold)] mb-0.5">
                          <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-gold)] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent-gold)]" /></span>
                          <span className="truncate">{(activeProduct as any).categoryLabel ?? (activeProduct as any).categories?.name ?? ''}</span>
                        </span>
                        <h3 className="text-[13px] xl:text-sm font-medium text-[var(--color-text-primary)] line-clamp-1 leading-tight">{activeProduct.name}</h3>
                        <p className="text-[11px] xl:text-xs text-[var(--color-text-tertiary)] line-clamp-1">{(activeProduct as any).tagline ?? ''}</p>
                        <p className="text-xs xl:text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">{formatPrice(Number(activeProduct.price))}</p>
                      </div>
                      <div className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] text-black flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            </motion.div>

            {/* Numbered index row + thumbnail rail - extends dot mechanism */}
            {hasHeroData && (
              <div className="flex items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2">
                  {heroSlides.map((_, idx) => {
                    const isActive = currentSlideIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={`font-mono text-xs tracking-widest transition-all min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full ${isActive ? 'bg-[var(--color-accent-gold)] text-black font-bold shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      >
                        0{idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  {heroSlides.map((slide, idx) => {
                    const isActive = currentSlideIndex === idx;
                    return (
                      <button
                        key={slide.id}
                        onClick={() => handleDotClick(idx)}
                        className={`relative w-12 h-12 xl:w-14 xl:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${isActive ? 'border-[var(--color-accent-gold)] shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:border-[var(--color-border)]'}`}
                        aria-label={`View ${slide.title}`}
                      >
                        <Image src={slide.image} alt={slide.title} fill className="object-cover" sizes="56px" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
