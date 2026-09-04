'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { Sparkles, Eye, MessageCircle, ArrowDown } from 'lucide-react';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';
import { useLiveProducts } from '@/hooks/useLiveProducts';

export default function ShopTheLook() {
  const { setQuickViewProduct, formatPrice } = useStore();
  const { products: liveProducts } = useLiveProducts();

  const stylingSlides = React.useMemo(() => {
    if (liveProducts.length === 0) return [];
    // Randomize slightly but keep it consistent for the session
    const shuffled = [...liveProducts].sort(() => 0.5 - Math.random()).slice(0, 6);
    return shuffled.map((p: any) => ({
      id: `look-${p.id}`,
      productId: p.id,
      title: p.name,
      description: (p.description ?? p.tagline ?? '').slice(0, 120),
      category: p.categoryLabel ?? p.categories?.name ?? p.category,
      // Prefer secondary images for lookbook if available, otherwise primary
      image: (p.images && p.images.length > 1) ? p.images[1] : (p.primaryImage ?? p.images?.[0] ?? ''),
    }));
  }, [liveProducts]);

  if (stylingSlides.length === 0) {
    return (
      <section id="lookbook" className="py-16 bg-[#0A0A0A] relative flex items-center justify-center min-h-[50vh]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-[#B38344]" />
          </div>
          <h2 className="font-serif text-3xl text-white mb-2">Lookbook</h2>
          <p className="text-neutral-400">Curating the finest atelier pieces. Coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="lookbook" className="relative w-full bg-black overflow-hidden select-none">
      
      {/* Editorial Header */}
      <div className="absolute top-0 inset-x-0 z-40 p-6 sm:p-10 pointer-events-none flex justify-between items-start">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white drop-shadow-xl tracking-tight">Curated Looks</h2>
          <p className="text-white/80 text-xs sm:text-sm uppercase tracking-[0.2em] mt-2 font-medium">The Signature Selection</p>
        </div>
        <div className="hidden sm:flex flex-col items-center gap-2 text-white/80 drop-shadow-lg">
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      {/* Snap Scrolling Container */}
      <div 
        className="h-[85vh] lg:h-[95vh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          #lookbook div::-webkit-scrollbar { display: none; }
        `}} />

        {stylingSlides.map((slide, idx) => {
          const product = liveProducts.find((p) => p.id === slide.productId);
          const formattedPrice = product ? formatPrice(Number(product.price)) : '';
          const whatsappUrl = product ? getWhatsAppOrderUrl(product.name, formattedPrice) : '#';

          return (
            <div 
              key={slide.id} 
              className="relative w-full h-full snap-start snap-always flex items-center justify-center overflow-hidden bg-[#111]"
            >
              {/* Image Layer */}
              <div className="absolute inset-0">
                <Image 
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center lg:object-[center_20%] scale-105"
                />
              </div>

              {/* Cinematic Lighting/Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
              
              {/* Floating Glassmorphic Details Card */}
              <div className="absolute bottom-6 sm:bottom-12 inset-x-4 sm:inset-x-auto sm:right-12 sm:w-[420px] z-30">
                <motion.div
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-black/40 backdrop-blur-2xl border border-white/10 p-5 sm:p-7 rounded-2xl shadow-2xl flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#B38344]">
                          Look 0{idx + 1}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span className="text-[9px] uppercase tracking-widest text-white/60">
                          {slide.category}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-white leading-tight truncate">
                        {slide.title}
                      </h3>
                    </div>
                    {product && (
                      <span className="text-white font-medium text-lg shrink-0 mt-1">
                        {formattedPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-white/70 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {slide.description || 'An exclusive piece from our latest curated collection, crafted with uncompromising attention to detail.'}
                  </p>

                  <div className="flex items-center gap-3 mt-1">
                    <button 
                      onClick={() => product && setQuickViewProduct(product)}
                      className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> 
                      <span>Inspect</span>
                    </button>
                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> 
                      <span>Acquire</span>
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Minimalist Slide Counter (Mobile mostly) */}
              <div className="absolute bottom-6 left-6 hidden lg:flex items-center gap-2 z-20 pointer-events-none mix-blend-difference text-white">
                <span className="text-3xl font-serif">0{idx + 1}</span>
                <span className="w-8 h-[1px] bg-white/30" />
                <span className="text-sm font-medium opacity-50">0{stylingSlides.length}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Persistent Side Navigation Dots for Desktop */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4 pointer-events-none mix-blend-difference">
        {stylingSlides.map((_, idx) => (
          <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white opacity-40 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        ))}
      </div>

    </section>
  );
}
