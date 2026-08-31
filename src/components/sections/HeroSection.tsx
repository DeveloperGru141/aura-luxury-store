'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLiveProducts } from '@/hooks/useLiveProducts';

export default function HeroSection() {
  const { setQuickViewProduct, formatPrice } = useStore();
  const { products: liveProducts } = useLiveProducts();

  // Live products only — no mock fallback
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
    }));
  }, [liveProducts]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    if (currentSlideIndex >= heroSlides.length && heroSlides.length > 0) setCurrentSlideIndex(0);
  }, [heroSlides.length, currentSlideIndex]);

  const currentSlide = heroSlides.length > 0 ? heroSlides[currentSlideIndex % heroSlides.length] : null;
  const activeProduct = currentSlide ? (liveProducts.find((p) => p.id === currentSlide.productId) || liveProducts[0] as any) : null;

  const handleNext = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
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

  return (
    <section id="home" className="relative overflow-hidden pt-6 sm:pt-8 pb-8 sm:pb-12 lg:py-16 bg-[#121212]">
      {/* Warm matte, no synthetic orbs */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-4 flex flex-col items-start text-left w-full min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] border border-[#E2DDD5] px-3 py-1 text-[10px] font-semibold tracking-wide text-[#1A1918] mb-3 sm:mb-4 reveal-subhead">ILORIN ATELIER • Insured Nationwide & Global Delivery</p>

            <h1 className="font-serif text-[clamp(28px,7vw,36px)] sm:text-5xl lg:text-[42px] xl:text-5xl font-light text-white tracking-tight leading-[1.12] sm:leading-[1.14] mb-3 sm:mb-4 w-full reveal-headline">
              Crafted in Ilorin, <br />
              <span className="italic font-normal gold-gradient-text">designed for distinction.</span>
            </h1>

            <p className="text-[13px] sm:text-sm text-gray-300 max-w-[32ch] sm:max-w-sm font-light leading-relaxed mb-5 sm:mb-6 reveal-subhead">
              Omo Esho Signatures brings together small-run leatherwork, fine silks, precision timepieces, and 18k gold—curated locally in Ilorin and delivered worldwide with insured courier care.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6 sm:mb-8 reveal-cta">
              <a
                href="#categories"
                className="relative overflow-hidden py-3.5 sm:py-3 px-6 rounded-xl bg-gradient-to-r from-[#8C7A5B] via-[#E2C366] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:brightness-95 active:scale-[0.98] transition-all shadow-xl shadow-[#8C7A5B]/15 min-h-[44px] touch-manipulation group/cta"
              >
                <span className="shimmer-sheen" />
                <span className="relative z-10">Explore Collections</span>
                <ArrowRight className="w-4 h-4 shrink-0 relative z-10 group-hover/cta:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="#lookbook"
                className="py-3.5 sm:py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-white font-medium text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
              >
                <span>View Lookbook</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-5 sm:pt-6 border-t border-white/10 w-full max-w-[320px] sm:max-w-sm text-left">
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-white font-serif text-base sm:text-lg font-bold"><span>100%</span></div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-0.5 leading-tight">Authentic</p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[#8C7A5B] font-serif text-base sm:text-lg font-bold"><span>4.9★</span></div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-0.5 leading-tight">Rating</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 relative w-full min-w-0">
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#161922] group touch-pan-y"
            >
              {heroSlides.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF8F5] p-8 text-center">
                  <p className="font-serif text-base font-light text-[#1A1918] mb-2">Next Small-Run Drop Releasing Soon • Chat with Concierge to Reserve</p>
                  <p className="text-xs text-[#5C5852] max-w-xs leading-relaxed mb-4">Small-batch leatherwork and silks are in finishing at the Ilorin atelier. Message for lot photos and early access.</p>
                  <a href="https://wa.me/2347065076565?text=Hi%20Omo%20Esho%20Signatures,%20please%20add%20me%20to%20the%20waitlist%20for%20the%20next%20drop." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#121212] text-white px-4 py-2 text-xs font-medium hover:bg-[#1A1918] transition-colors">Chat with Concierge to Reserve</a>
                </div>
              ) : (
                heroSlides.map((slide, idx) => {
                  const isActive = currentSlideIndex === idx;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-[opacity] duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    >
                      <Image src={slide.image} alt={slide.title} fill priority={idx === 0} className={`object-cover object-center ${isActive ? 'animate-hero-drift' : ''}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30" />
                    </div>
                  );
                })
              )}

              {heroSlides.length > 0 && (
                <>
                  <button onClick={handlePrev} className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 active:bg-black text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-lg touch-manipulation" aria-label="Previous slide">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleNext} className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 active:bg-black text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-lg touch-manipulation" aria-label="Next slide">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {activeProduct && (
                <div onClick={() => setQuickViewProduct(activeProduct)} className="absolute bottom-10 sm:bottom-12 inset-x-3 sm:inset-x-4 lg:inset-x-8 z-20 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl glass-panel text-white cursor-pointer border border-[#8C7A5B]/30 hover:border-[#8C7A5B]/60 active:scale-[0.98] transition-all flex items-center justify-between gap-2 sm:gap-3 group/card shadow-2xl touch-manipulation min-h-[72px] animate-gold-pulse">
                  <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                      <Image src={(activeProduct as any).primaryImage ?? (activeProduct as any).images?.[0] ?? ''} alt={activeProduct.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#8C7A5B] mb-0.5">
                        <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8C7A5B] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#8C7A5B]" /></span>
                        <span className="truncate">{(activeProduct as any).categoryLabel ?? (activeProduct as any).categories?.name ?? ''}</span>
                      </span>
                      <h3 className="text-[13px] sm:text-sm lg:text-base font-serif font-medium text-white line-clamp-1">{activeProduct.name}</h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#EFECE6]">{formatPrice(Number(activeProduct.price))}</p>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 group-hover/card:bg-[#8C7A5B] group-hover/card:text-black transition-colors shrink-0 flex items-center gap-1 text-xs font-semibold min-h-[36px] min-w-[36px] justify-center">
                    <span className="hidden sm:inline">Inspect</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}

              {heroSlides.length > 0 && (
                <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5 sm:gap-2">
                  {heroSlides.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlideIndex(idx)} className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer touch-manipulation min-h-[8px] min-w-[8px] ${currentSlideIndex === idx ? 'w-6 sm:w-8 bg-[#8C7A5B]' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'}`} aria-label={`Go to slide ${idx + 1}`} />
                  ))}
                </div>
              )}
            </div>
            <div className="hidden sm:block absolute -bottom-3 -right-3 -z-10 w-full h-full rounded-3xl border border-[#8C7A5B]/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
