'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Timer, Copy, Check, Sparkles, Flame, ArrowRight } from 'lucide-react';

export default function FlashDropBanner() {
  const { showToast, formatPrice } = useStore();
  const [copied, setCopied] = useState(false);

  // Dynamic countdown timer (e.g. 14 hours 28 mins left)
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

  const copyVipCode = () => {
    navigator.clipboard?.writeText('VIP20');
    setCopied(true);
    showToast('VIP Voucher "VIP20" copied! (20% OFF Orders > ₦500,000)', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="flash-drop" className="py-16 bg-[#0E1117] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-r from-[#141720] via-[#1B1E28] to-[#141720] p-8 sm:p-12 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Info & Timer */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold mb-4">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Midnight Vault &bull; Limited Allocation Drop</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-3">
                The Rose Gold &amp; <span className="italic font-normal gold-gradient-text">Emerald Vault</span>
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 max-w-lg mb-8 leading-relaxed font-light">
                Only 25 numbered pieces of the Chronographe Imperial and 18k Solitaire Diamond Chokers remain in reserve. Unlock 20% off high-tier allocations with your exclusive invitation code.
              </p>

              {/* Countdown Digits */}
              <div className="flex items-center gap-3 sm:gap-4 mb-8">
                <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-black/50 border border-white/10 text-white">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#F3E5AB]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">Hours</span>
                </div>

                <span className="text-2xl font-serif text-[#D4AF37]">:</span>

                <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-black/50 border border-white/10 text-white">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#F3E5AB]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">Mins</span>
                </div>

                <span className="text-2xl font-serif text-[#D4AF37]">:</span>

                <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-black/50 border border-white/10 text-white">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#F3E5AB]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">Secs</span>
                </div>
              </div>

              {/* Code Box & CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={copyVipCode}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-black/60 border border-[#D4AF37]/50 text-xs font-mono font-bold text-[#F3E5AB] hover:bg-black/90 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>USE CODE: VIP20</span>
                  </div>
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
                </button>

                <a
                  href="#catalogue"
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  <span>Explore Vault Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-4 relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop"
                alt="Limited Drop Chronometer"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">Reserve Allocation</span>
                <p className="font-serif text-sm text-white font-medium">Astral Diamond Skeleton Dial</p>
                <p className="text-xs font-semibold text-[#F3E5AB]">{formatPrice(1850000)} &bull; Swiss Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
