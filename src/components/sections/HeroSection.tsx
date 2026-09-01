'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
      image: p.primaryImage ?? p.images?.[0] ?? '',
      price: p.price,
    }));
  }, [liveProducts]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (heroSlides.length === 0) return;
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
  }, [heroSlides.length]);

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

  // Collapse gracefully if no hero data
  const hasHeroData = heroSlides.length > 0;

  return (
    <section id="home" className="relative overflow-hidden pt-6 sm:pt-8 pb-8 sm:pb-12 lg:py-16 bg-gradient-to-b from-[#0D0F14] via-[#10131A] to-[#0D0F14]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-amber-900/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile: side-by-side text + carousel (52/48), Desktop: 4/8 grid */}
        <div className="flex gap-3 items-start lg:hidden mb-4">
          {/* Left column — text only (eyebrow, H1, subhead) */}
          <div className="w-[52%] min-w-0">
            <p className="text-[11px] font-medium tracking-wide text-[#D4AF37] leading-tight">Handcrafted in Ilorin — leather, silk &amp; Swiss-sourced timepieces</p>
            <h1 className="font-serif text-[22px] leading-tight font-light text-white tracking-tight mt-1.5">
              Leather &amp; silk, made by hand <em className="italic font-normal gold-gradient-text">in Ilorin.</em>
            </h1>
            <p className="text-[12px] text-gray-400 font-light mt-2 leading-snug">Timepieces, sourced from Switzerland.</p>
          </div>

          {/* Right column — single-card carousel */}
          <div className="w-[48%] min-w-0">
            {!hasHeroData ? (
              <div className="aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-4 text-center">
                <p className="text-xs font-medium text-white">Next drop soon</p>
                <p className="text-[10px] text-gray-400 mt-1">Join waitlist on WhatsApp</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/10 bg-[#161922] touch-pan-y" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                {heroSlides.map((slide, idx) => {
                  const isActive = currentSlideIndex === idx;
                  const product = liveProducts.find((p) => p.id === slide.productId);
                  return (
                    <div key={slide.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                      <Image src={slide.image} alt={slide.title} fill className="object-cover" sizes="48vw" priority={idx === 0} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-2.5 flex items-end justify-between gap-1.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span className="text-amber-400 text-[9px] tracking-wide uppercase truncate">{slide.category}</span>
                          </div>
                          <p className="text-white text-xs font-medium truncate leading-tight">{slide.title}</p>
                          <p className="text-amber-400 text-[11px] font-medium">{product ? formatPrice(Number(product.price)) : ''}</p>
                        </div>
                        <button onClick={() => product && setQuickViewProduct(product)} aria-label={`View ${slide.title}`} className="shrink-0 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center active:scale-95 transition-transform">
                          <ArrowRight className="w-3 h-3 text-black" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {/* Dot indicators */}
                <div className="absolute top-2 inset-x-0 flex justify-center gap-1 z-10">
                  {heroSlides.map((_, idx) => (
                    <button key={idx} onClick={() => handleDotClick(idx)} className={`h-1 rounded-full transition-all ${currentSlideIndex === idx ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} aria-label={`Go to slide ${idx + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop text block (keeps original desktop layout) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 flex flex-col items-start text-left w-full min-w-0">
            <p className="text-xs font-medium tracking-wide text-[#D4AF37] mb-4">Handcrafted in Ilorin — leather, silk &amp; Swiss-sourced timepieces</p>
            <h1 className="font-serif text-5xl font-light text-white tracking-tight leading-tight mb-4">
              Leather &amp; silk, made by hand <span className="italic font-normal gold-gradient-text">in Ilorin.</span><br />
              <span className="text-2xl font-normal text-gray-400">Timepieces, sourced from Switzerland.</span>
            </h1>
            <p className="text-sm text-gray-300 max-w-sm font-light leading-relaxed mb-6">
              Every bag and silk piece is cut and stitched by hand in our Ilorin workshop. Our watches come directly from Swiss makers and are inspected here before they ship — with insured courier delivery, worldwide.
            </p>
            <div className="flex items-center gap-3 mb-8">
              <a href="#categories" className="relative overflow-hidden py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl min-h-[44px] group/cta">
                <span className="shimmer-sheen" />
                <span className="relative z-10">Explore Collections</span>
                <ArrowRight className="w-4 h-4 shrink-0 relative z-10" />
              </a>
              <a href="#lookbook" className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs uppercase tracking-widest text-center min-h-[44px] flex items-center justify-center gap-2">
                <span>View Lookbook</span>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/10 w-full max-w-sm text-left">
              <div>
                <div className="flex items-center gap-1 text-white font-serif text-lg font-bold">
                  <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]" /></span>
                  <span>HANDCRAFTED IN ILORIN</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-white font-serif text-lg font-bold">
                  <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]" /></span>
                  <span>WORLDWIDE INSURED DELIVERY</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 relative w-full min-w-0 hidden lg:block">
            <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="relative aspect-[16/9] min-h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#161922] group touch-pan-y">
              {heroSlides.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0F14] p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">Curated collection coming soon</p>
                  <p className="text-xs text-gray-400 max-w-xs">Add products in the admin dashboard to populate the hero showcase.</p>
                </div>
              ) : (
                <>
                  {heroSlides.map((slide, idx) => {
                    const isActive = currentSlideIndex === idx;
                    return (
                      <div key={slide.id} className={`absolute inset-0 transition-[opacity] duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                        <Image src={slide.image} alt={slide.title} fill priority={idx === 0} className={`object-cover object-center ${isActive ? 'animate-hero-drift' : ''}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30" />
                      </div>
                    );
                  })}
                  <button onClick={handlePrev} className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md shadow-lg" aria-label="Previous slide">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleNext} className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md shadow-lg" aria-label="Next slide">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {activeProduct && (
                    <div onClick={() => setQuickViewProduct(activeProduct)} className="absolute bottom-12 inset-x-8 z-20 p-5 rounded-2xl glass-panel text-white cursor-pointer border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 active:scale-[0.98] transition-all flex items-center justify-between gap-3 group/card shadow-2xl min-h-[72px] animate-gold-pulse">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                          <Image src={(activeProduct as any).primaryImage ?? (activeProduct as any).images?.[0] ?? ''} alt={activeProduct.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-0.5">
                            <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]" /></span>
                            <span className="truncate">{(activeProduct as any).categoryLabel ?? (activeProduct as any).categories?.name ?? ''}</span>
                          </span>
                          <h3 className="text-base font-serif font-medium text-white line-clamp-1">{activeProduct.name}</h3>
                          <p className="text-sm font-semibold text-[#F3E5AB]">{formatPrice(Number(activeProduct.price))}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/10 group-hover/card:bg-[#D4AF37] group-hover/card:text-black transition-colors shrink-0 flex items-center gap-1 text-xs font-semibold min-h-[36px] min-w-[36px] justify-center">
                        <span>Inspect</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center items-center gap-2">
                    {heroSlides.map((_, idx) => (
                      <button key={idx} onClick={() => handleDotClick(idx)} className={`h-1.5 rounded-full transition-all ${currentSlideIndex === idx ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/40 hover:bg-white/70'}`} aria-label={`Go to slide ${idx + 1}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="hidden sm:block absolute -bottom-3 -right-3 -z-10 w-full h-full rounded-3xl border border-[#D4AF37]/20" />
          </div>
        </div>

        {/* Mobile full-width below the two-column row: paragraph, CTAs, stats */}
        <div className="lg:hidden mt-4">
          <p className="text-[13px] text-gray-300 font-light leading-relaxed">
            Every bag and silk piece is cut and stitched by hand in our Ilorin workshop. Our watches come directly from Swiss makers and are inspected here before they ship — with insured courier delivery, worldwide.
          </p>
          <div className="flex flex-col gap-3 mt-4">
            <a href="#categories" className="relative overflow-hidden py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 min-h-[44px] group/cta">
              <span className="shimmer-sheen" />
              <span className="relative z-10">Explore Collections</span>
              <ArrowRight className="w-4 h-4 shrink-0 relative z-10" />
            </a>
            <a href="#lookbook" className="py-3.5 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs uppercase tracking-widest text-center min-h-[44px] flex items-center justify-center gap-2">
              <span>View Lookbook</span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-5 mt-4 border-t border-white/10 text-left">
            <div>
              <div className="flex items-center gap-1 text-white font-serif text-sm font-bold">
                <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]" /></span>
                <span>HANDCRAFTED IN ILORIN</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-white font-serif text-sm font-bold">
                <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]" /></span>
                <span>WORLDWIDE INSURED DELIVERY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}