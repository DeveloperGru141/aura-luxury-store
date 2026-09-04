'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Genevieve Du Pont',
    location: 'Ilorin, Nigeria',
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
    location: 'Ilorin, Nigeria',
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
    location: 'Ilorin, Nigeria',
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
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="reviews" className="py-12 sm:py-16 lg:py-24 bg-[var(--color-surface)] border-t border-[var(--color-border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C43] mb-1">
              Client Testimonials
            </p>
            <h2 className="font-serif text-[26px] sm:text-3xl lg:text-4xl font-light text-[var(--color-text-primary)] leading-tight">
              What <span className="italic font-normal text-[#B38344]">clients</span> say
            </h2>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-[var(--color-border)] shrink-0 w-full md:w-auto justify-between md:justify-start shadow-sm">
            <div className="flex items-center gap-1 text-[#B38344]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#B38344]" />
              ))}
            </div>
            <span className="text-sm font-serif font-bold text-[var(--color-text-primary)]">4.9 out of 5</span>
            <span className="text-[11px] sm:text-xs text-[var(--color-text-tertiary)] font-light hidden sm:inline">from verified bespoke orders</span>
            <span className="text-[11px] text-[var(--color-text-tertiary)] font-light sm:hidden">Verified orders</span>
          </div>
        </motion.div>

        {/* Review Cards Grid with Staggered Scroll Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {CUSTOMER_REVIEWS.map((rev) => (
            <motion.div
              key={rev.id}
              variants={cardVariants}
              className="flex flex-col justify-between p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[var(--color-border)] hover:border-[#B38344]/40 hover:shadow-md active:scale-[0.99] transition-all duration-300 group touch-manipulation relative"
            >
              <div>
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-[#B38344]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B38344]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-300 group-hover:text-[#B38344] transition-colors" />
                </div>

                {/* Review Headline & Text */}
                <h3 className="font-serif text-base sm:text-lg font-medium text-[var(--color-text-primary)] mb-3 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] font-light leading-relaxed mb-6">
                  {rev.comment}
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-5 border-t border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[var(--color-surface-alt)] shrink-0 border border-[var(--color-border)]">
                    <Image
                      src={rev.productImage}
                      alt={rev.productName}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
                      <span>{rev.author}</span>
                      {rev.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#B38344]" />}
                    </h4>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{rev.location}</p>
                  </div>
                </div>

                <span className="text-[10px] text-[var(--color-text-muted)]">{rev.date}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
