import React from 'react';
import Image from 'next/image';
import { CUSTOMER_REVIEWS } from '@/data/mockData';
import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react';

export default function CustomerReviews() {
  return (
    <section className="py-24 bg-[#0D0F14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Patron Reviews</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white">
              Voices of <span className="italic font-normal gold-gradient-text">Distinction</span>
            </h2>
          </div>

          {/* Rating Summary Pill */}
          <div className="mt-4 md:mt-0 flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-serif font-bold text-white">4.9 / 5.0</span>
            <span className="text-xs text-gray-400 font-light">&bull; Over 2,400 Verified Clients</span>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between p-8 rounded-3xl bg-[#13161E] border border-white/5 hover:border-[#D4AF37]/30 transition-all group"
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
