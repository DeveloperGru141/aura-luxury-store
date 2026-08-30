'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Sparkles, Eye, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';
import { useLiveProducts } from '@/hooks/useLiveProducts';

export default function ShopTheLook() {
  const { setQuickViewProduct, formatPrice } = useStore();
  const { products: liveProducts } = useLiveProducts();

  // Live-only curated showcase — no mock fallback
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

  useEffect(() => {
    if (stylingSlides.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setCurrentIndex((prev) => (prev + 1) % stylingSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [stylingSlides.length]);

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
      <section id="lookbook" className="py-12 sm:py-16 lg:py-24 bg-[#0A0C0F] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-[#D4AF37]/5 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3E5AB] text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3"><Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /><span>Living Showcase</span></div>
              <h2 className="font-serif text-[26px] sm:text-3xl lg:text-4xl font-light text-white leading-tight">Curated <span className="italic font-normal gold-gradient-text">Lookbook</span></h2>
            </div>
            <p className="text-[13px] sm:text-sm text-gray-400 max-w-md font-light leading-relaxed">A seamless transition of master Swiss timepieces, bespoke wears, luxury shoes, and handcrafted Italian leather bags.</p>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#14171E] p-10 sm:p-14 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4"><Sparkles className="w-7 h-7 text-[#D4AF37]" /></div>
            <p className="text-sm font-medium text-white mb-1">Lookbook coming soon</p>
            <p className="text-xs text-gray-400">Add products in the admin dashboard to populate the curated showcase.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lookbook" className="py-12 sm:py-16 lg:py-24 bg-[#0A0C0F] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-[#D4AF37]/5 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3E5AB] text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /><span>Living Showcase</span>
            </div>
            <h2 className="font-serif text-[26px] sm:text-3xl lg:text-4xl font-light text-white leading-tight">Curated <span className="italic font-normal gold-gradient-text">Lookbook</span></h2>
          </div>
          <p className="text-[13px] sm:text-sm text-gray-400 max-w-md font-light leading-relaxed">A seamless transition of master Swiss timepieces, bespoke wears, luxury shoes, and handcrafted Italian leather bags.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#14171E] group min-h-[280px] sm:min-h-[360px] touch-pan-y">
            {stylingSlides.map((slide, idx) => {
              const isActive = currentIndex === idx;
              return (
                <div key={slide.id} className={`absolute inset-0 transition-[opacity,transform] duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none scale-105'}`}>
                  <Image src={slide.image} alt={slide.title} fill priority={idx === 0} className="mobile-category-img object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
                </div>
              );
            })}

            <button onClick={handlePrev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 active:bg-black text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-lg touch-manipulation" aria-label="Previous look"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={handleNext} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 active:bg-black text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-lg touch-manipulation" aria-label="Next look"><ChevronRight className="w-4 h-4" /></button>

            {currentSlide && (
              <div className="absolute bottom-5 sm:bottom-6 inset-x-4 sm:inset-x-6 z-20 hidden sm:block pointer-events-none">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">{currentSlide.category}</span>
                <h3 className="font-serif text-xl lg:text-2xl font-light text-white line-clamp-1">{currentSlide.title}</h3>
              </div>
            )}

            <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5 sm:gap-2">
              {stylingSlides.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer touch-manipulation min-h-[8px] min-w-[8px] ${currentIndex === idx ? 'w-6 sm:w-8 bg-[#D4AF37]' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'}`} aria-label={`Go to look ${idx + 1}`} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 sm:gap-4">
            {activeProduct && (
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#13161D] border border-[#D4AF37]/40 shadow-2xl flex flex-col justify-between animate-gold-pulse">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                      <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]" /></span>
                      <span>{(activeProduct as any).categoryLabel ?? (activeProduct as any).categories?.name ?? ''}</span>
                    </span>
                    <span className={`font-medium text-[11px] ${(activeProduct as any).stock_status === 'out_of_stock' || (activeProduct as any).inStock === false ? 'text-amber-400' : 'text-emerald-400'}`}>&bull; {(activeProduct as any).stock_status === 'out_of_stock' || (activeProduct as any).inStock === false ? 'Out of Stock' : 'In Stock'}</span>
                  </div>
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-800 mb-4 border border-white/5">
                    <Image src={(activeProduct as any).primaryImage ?? (activeProduct as any).images?.[0] ?? ''} alt={activeProduct.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-white mb-1">{activeProduct.name}</h3>
                  <p className="text-xs text-gray-300 line-clamp-2 mb-4 leading-relaxed font-light">{activeProduct.description}</p>
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-white/5">
                    <span className="text-xs text-gray-400">Price</span><span className="text-lg font-bold text-[#F3E5AB]">{formatPrice(Number(activeProduct.price))}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setQuickViewProduct(activeProduct)} className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-xs font-medium text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation min-h-[40px]"><Eye className="w-3.5 h-3.5 text-[#D4AF37]" /><span>Quick View</span></button>
                    <a href={whatsappOrderUrl} target="_blank" rel="noopener noreferrer" className="relative overflow-hidden py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-[0.98] shadow-lg cursor-pointer touch-manipulation min-h-[40px]"><span className="shimmer-sheen" /><MessageCircle className="w-3.5 h-3.5 relative z-10" /><span className="relative z-10">Order</span></a>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block px-2 mb-1">Curated Transitions ({stylingSlides.length} Items)</span>
              {stylingSlides.map((slide, idx) => {
                const isSelected = currentIndex === idx;
                const prod = liveProducts.find((p) => p.id === slide.productId);
                return (
                  <button key={slide.id} onClick={() => setCurrentIndex(idx)} className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between text-xs cursor-pointer touch-manipulation ${isSelected ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-white font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'}`}>
                    <span className="truncate">{slide.title}</span>
                    {prod && <span className="text-[11px] font-semibold text-[#F3E5AB] shrink-0 ml-2">{formatPrice(Number(prod.price))}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
