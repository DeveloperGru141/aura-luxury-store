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
    <section id="home" className="relative overflow-hidden pt-6 sm:pt-8 pb-8 sm:pb-12 lg:py-16 bg-gradient-to-b from-[#0D0F14] via-[#10131A] to-[#0D0F14]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-amber-900/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-4 flex flex-col items-start text-left w-full min-w-0">
            <p className="text-xs font-medium tracking-wide text-[#D4AF37] mb-3 sm:mb-4 reveal-subhead">Bags, wears and wristwatches — made in small runs</p>

            <h1 className="font-serif text-[clamp(28px,7vw,36px)] sm:text-5xl lg:text-[42px] xl:text-5xl font-light text-white tracking-tight leading-[1.12] sm:leading-[1.14] mb-3 sm:mb-4 w-full reveal-headline">
              Leather stitched in Florence, <br />
              <span className="italic font-normal gold-gradient-text">silk cut in Como.</span>
            </h1>

            <p className="text-[13px] sm:text-sm text-gray-300 max-w-[32ch] sm:max-w-sm font-light leading-relaxed mb-5 sm:mb-6 reveal-subhead">
              Omo Esho Signatures sources five houses — Italian calfskin bags, 22-momme silk wears, Blake-stitched shoes, Swiss automatic calibres and 18k gold — all priced in naira and shipped insured from Lagos.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6 sm:mb-8 reveal-cta">
              <a
                href="#categories"
                className="relative overflow-hidden py-3.5 sm:py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:brightness-95 active:scale-[0.98] transition-all shadow-xl shadow-[#D4AF37]/15 min-h-[44px] touch-manipulation group/cta"
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

            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 sm:pt-6 border-t border-white/10 w-full max-w-[320px] sm:max-w-sm text-left">
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-white font-serif text-base sm:text-lg font-bold"><span>50k+</span></div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-0.5 leading-tight">Clients</p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-white font-serif text-base sm:text-lg font-bold"><span>100%</span></div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-0.5 leading-tight">Authentic</p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[#D4AF37] font-serif text-base sm:text-lg font-bold"><span>4.9★</span></div>
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
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0F14] p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">Curated collection coming soon</p>
                  <p className="text-xs text-gray-400 max-w-xs">Add products in the admin dashboard to populate the hero showcase.</p>
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
                <div onClick={() => setQuickViewProduct(activeProduct)} className="absolute bottom-10 sm:bottom-12 inset-x-3 sm:inset-x-4 lg:inset-x-8 z-20 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl glass-panel text-white cursor-pointer border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 active:scale-[0.98] transition-all flex items-center justify-between gap-2 sm:gap-3 group/card shadow-2xl touch-manipulation min-h-[72px] animate-gold-pulse">
                  <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                      <Image src={(activeProduct as any).primaryImage ?? (activeProduct as any).images?.[0] ?? ''} alt={activeProduct.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-0.5">
                        <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]" /></span>
                        <span className="truncate">{(activeProduct as any).categoryLabel ?? (activeProduct as any).categories?.name ?? ''}</span>
                      </span>
                      <h3 className="text-[13px] sm:text-sm lg:text-base font-serif font-medium text-white line-clamp-1">{activeProduct.name}</h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#F3E5AB]">{formatPrice(Number(activeProduct.price))}</p>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 group-hover/card:bg-[#D4AF37] group-hover/card:text-black transition-colors shrink-0 flex items-center gap-1 text-xs font-semibold min-h-[36px] min-w-[36px] justify-center">
                    <span className="hidden sm:inline">Inspect</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}

              {heroSlides.length > 0 && (
                <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5 sm:gap-2">
                  {heroSlides.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlideIndex(idx)} className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer touch-manipulation min-h-[8px] min-w-[8px] ${currentSlideIndex === idx ? 'w-6 sm:w-8 bg-[#D4AF37]' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'}`} aria-label={`Go to slide ${idx + 1}`} />
                  ))}
                </div>
              )}
            </div>
            <div className="hidden sm:block absolute -bottom-3 -right-3 -z-10 w-full h-full rounded-3xl border border-[#D4AF37]/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
