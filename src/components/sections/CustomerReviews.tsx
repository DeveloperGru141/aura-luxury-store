import React from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Genevieve Du Pont',
    location: 'Paris, France',
    rating: 5,
    title: 'Unrivaled craftsmanship in leather and finishing',
    comment: 'The Monceau croc satchel exceeded all my expectations. The leather texture, weight of the gold hardware, and the hand-burnished edges are immaculate. I receive compliments every single day.',
    productName: 'Monceau Croc-Embossed Satchel',
    productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop',
    date: 'February 18, 2026',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Alexander Sterling',
    location: 'Zurich, Switzerland',
    rating: 5,
    title: 'The chronograph mechanism is a true work of horological art',
    comment: 'As a long-time timepieces collector, I was astonished by the build quality and finishing on the Chronographe Imperial. The 68-hour power reserve is rock solid and the dial depth is stunning in natural sunlight.',
    productName: 'Chronographe Imperial Automatic',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
    date: 'January 24, 2026',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Elena Rostova',
    location: 'London, UK',
    rating: 5,
    title: 'Bespoke packaging and exquisite diamond brilliance',
    comment: 'Ordered the Lumière 18k choker for our anniversary. It arrived in a stunning velvet monogrammed box with full authenticity documentation. The sparkle is radiant and it sits perfectly on the collarbone.',
    productName: 'Lumière 18k Solitaire Diamond Choker',
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop',
    date: 'February 02, 2026',
    verified: true,
  },
];

export default function CustomerReviews() {
  return (
    <section id="reviews" className="py-12 sm:py-16 lg:py-24 bg-[#0D0F14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — concrete, no decorative eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 lg:mb-16">
          <div className="min-w-0">
            <h2 className="font-serif text-[26px] sm:text-3xl lg:text-4xl font-light text-white leading-tight">
              What <span className="italic font-normal gold-gradient-text">clients</span> say
            </h2>
          </div>

          {/* Rating Summary — plain phrasing, no middle-dot meta */}
          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 shrink-0 w-full md:w-auto justify-between md:justify-start shadow-lg">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-serif font-bold text-white">4.9 out of 5</span>
            <span className="text-[11px] sm:text-xs text-gray-400 font-light hidden sm:inline">from over 2,400 verified orders</span>
            <span className="text-[11px] text-gray-400 font-light sm:hidden">2,400+ orders</span>
          </div>
        </div>

        {/* Review Cards — snap carousel on mobile with peek, grid on desktop */}
        <div className="flex lg:grid lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none -mx-4 lg:mx-0 px-4 lg:px-0 pb-1 lg:pb-0 overscroll-x-contain">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="snap-start shrink-0 w-[84vw] max-w-[320px] lg:w-auto lg:max-w-none flex flex-col justify-between p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-[#13161E] border border-white/5 hover:border-[#D4AF37]/35 active:border-[#D4AF37]/50 active:scale-[0.97] transition-all duration-150 group touch-manipulation relative"
            >
              <div>
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-gray-600 group-hover:text-[#D4AF37] transition-colors opacity-40" />
                </div>

                {/* Review Headline & Text */}
                <h3 className="font-serif text-base font-medium text-white mb-3 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h3>
                <p className="text-xs text-gray-300 font-light leading-relaxed mb-6">
                  {rev.comment}
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                    <Image
                      src={rev.productImage}
                      alt={rev.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1">
                      <span>{rev.author}</span>
                      {rev.verified && <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />}
                    </h4>
                    <p className="text-[10px] text-gray-400">{rev.location}</p>
                  </div>
                </div>

                <span className="text-[10px] text-gray-500">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
