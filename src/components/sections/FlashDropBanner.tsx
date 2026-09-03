'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Flame, ArrowRight } from 'lucide-react';

export default function FlashDropBanner() {
  const { formatPrice } = useStore();

  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="flash-drop" className="py-10 sm:py-12 bg-[var(--color-surface-alt)] relative border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="lg:col-span-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Midnight Vault • Limited Allocation Drop</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[var(--color-text-primary)] mb-3">
                The Rose Gold &amp; Emerald Vault
              </h2>

              <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] max-w-lg mb-6 leading-relaxed">
                Only 25 numbered pieces of the Chronographe Imperial and 18k Solitaire Diamond Chokers remain in reserve. Private allocation for distinguished clients.
              </p>

              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-sm">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--color-text-tertiary)]">Hours</span>
                </div>

                <span className="text-2xl font-serif text-[var(--color-accent-gold)]">:</span>

                <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-sm">
                  <span className="font-serif text-2xl sm:text-3xl font-bold">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--color-text-tertiary)]">Mins</span>
                </div>

                <span className="text-2xl font-serif text-[var(--color-accent-gold)]">:</span>

                <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-sm">
                  <span className="font-serif text-2xl sm:text-3xl font-bold">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--color-text-tertiary)]">Secs</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <a
                  href="#catalogue"
                  className="py-3 px-6 rounded-full bg-black hover:bg-zinc-900 active:scale-[0.97] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>Explore Vault Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 relative aspect-square rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm bg-[var(--color-surface-alt)]">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop"
                alt="Limited Drop Chronometer"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[var(--color-accent-gold)] block">Reserve Allocation</span>
                <p className="font-medium text-sm text-[var(--color-text-primary)]">Astral Diamond Skeleton Dial</p>
                <p className="text-xs font-semibold text-[var(--color-text-tertiary)]">{formatPrice(1850000)} • Ilorin Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
