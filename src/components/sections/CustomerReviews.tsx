import React from 'react';
import Image from 'next/image';
import { CUSTOMER_REVIEWS } from '@/data/mockData';
import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react';

export default function CustomerReviews() {
  return (
    <section id="reviews" className="py-12 sm:py-16 lg:py-24 bg-[#0D0F14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — fluid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 lg:mb-16">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3E5AB] text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Patron Reviews</span>
            </div>
            <h2 className="font-serif text-[26px] sm:text-3xl lg:text-4xl font-light text-white leading-tight">
              Voices of <span className="italic font-normal gold-gradient-text">Distinction</span>
            </h2>
          </div>

          {/* Rating Summary Pill — fluid */}
          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 shrink-0 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-serif font-bold text-white">4.9 / 5.0</span>
            <span className="text-[11px] sm:text-xs text-gray-400 font-light hidden sm:inline">&bull; Over 2,400 Verified Clients</span>
            <span className="text-[11px] text-gray-400 font-light sm:hidden">2.4k Vetted</span>
          </div>
        </div>

        {/* Review Cards Grid — fluid gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-[#13161E] border border-white/5 hover:border-[#D4AF37]/30 active:border-[#D4AF37]/40 transition-all group touch-manipulation"
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
