'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LOOKBOOK_HOTSPOTS, PRODUCTS } from '@/data/mockData';
import { useStore } from '@/context/StoreContext';
import { Plus, Eye, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';

export default function ShopTheLook() {
  const { setQuickViewProduct, addToCart, formatPrice } = useStore();
  const [activeSpotId, setActiveSpotId] = useState<string | null>(LOOKBOOK_HOTSPOTS[0].id);

  const activeSpot = LOOKBOOK_HOTSPOTS.find((s) => s.id === activeSpotId);
  const activeProduct = activeSpot ? PRODUCTS.find((p) => p.id === activeSpot.productId) : null;

  return (
    <section id="lookbook" className="py-24 bg-[#0A0C0F] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Interactive Editorial</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white mb-4">
            Shop The <span className="italic font-normal gold-gradient-text">Complete Ensemble</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light">
            Click on the glowing pins to explore the exact garments, timepieces, leather goods, and jewelry worn on the runway.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Editorial Canvas with Hotspots */}
          <div className="lg:col-span-8 relative aspect-[4/5] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#14171E] group">
            <Image
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1400&auto=format&fit=crop"
              alt="Editorial Haute Ensemble"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Hotspot Pins */}
            {LOOKBOOK_HOTSPOTS.map((spot) => {
              const isActive = activeSpotId === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveSpotId(spot.id)}
                  style={{ top: `${spot.yPercent}%`, left: `${spot.xPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-300 z-20 ${
                    isActive
                      ? 'bg-[#D4AF37] text-black scale-125 ring-4 ring-[#D4AF37]/40 shadow-lg'
                      : 'bg-black/70 text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-black border border-white/30 backdrop-blur-md scale-100'
                  }`}
                  aria-label={`Inspect ${spot.title}`}
                >
                  <Plus className="w-4 h-4 animate-pulse" />
                </button>
              );
            })}

            {/* Hint overlay */}
            <div className="absolute bottom-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>Click glowing pins to inspect attire</span>
            </div>
          </div>

          {/* Right Column: Selected Piece Spotlight & Look Pieces */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Active Spotlight Card */}
            {activeProduct && (
              <div className="p-6 rounded-3xl bg-[#13161D] border border-[#D4AF37]/40 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                      {activeProduct.categoryLabel}
                    </span>
                    <span className="text-emerald-400 font-medium text-[11px]">&bull; In Stock</span>
                  </div>

                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-800 mb-4 border border-white/5">
                    <Image
                      src={activeProduct.primaryImage}
                      alt={activeProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="font-serif text-lg font-medium text-white mb-1">
                    {activeProduct.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                    {activeProduct.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-white/5">
                    <span className="text-xs text-gray-400">Runway Price</span>
                    <span className="text-lg font-bold text-[#F3E5AB]">
                      {formatPrice(activeProduct.price)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setQuickViewProduct(activeProduct)}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Quick View</span>
                    </button>

                    <button
                      onClick={() => addToCart(activeProduct)}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 hover:brightness-110 shadow-lg"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List of all items in ensemble */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block px-2">
                All 4 Tagged Ensemble Pieces
              </span>
              {LOOKBOOK_HOTSPOTS.map((spot) => {
                const isSelected = activeSpotId === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setActiveSpotId(spot.id)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-white'
                        : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="font-serif font-medium truncate">{spot.title}</span>
                    <span className="text-[#F3E5AB] font-semibold shrink-0 ml-2">
                      {formatPrice(spot.price)}
                    </span>
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
