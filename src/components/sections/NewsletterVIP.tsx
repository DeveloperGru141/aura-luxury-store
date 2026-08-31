'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useStore } from '@/context/StoreContext';
import { Sparkles, ArrowRight, Check, Crown, Lock } from 'lucide-react';

export default function NewsletterVIP() {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8C7A5B', '#EFECE6', '#ffffff'],
    });

    setIsSubmitted(true);
    showToast('Welcome to the VIP Atelier! Code WELCOME10 is now activated.', 'success');
  };

  return (
    <section id="vip" className="py-24 bg-gradient-to-b from-[#0A0C0F] via-[#12151D] to-[#0A0C0F] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8C7A5B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Crown Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#8C7A5B]/10 border border-[#8C7A5B]/30 text-[#8C7A5B] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#8C7A5B]/10">
          <Crown className="w-7 h-7" />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#8C7A5B]" />
          <span>Maison Inner Circle</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white mb-4">
          Privileged <span className="italic font-normal gold-gradient-text">Invitations &amp; Drops</span>
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto font-light leading-relaxed mb-8">
          Join our distinguished collective. Subscribers receive priority allocation for limited horology releases, private lookbooks, and 15% off your inaugural order.
        </p>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 max-w-md mx-auto animate-scale-in">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-serif text-lg font-medium mb-1">
              <Check className="w-5 h-5" />
              <span>Membership Confirmed</span>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Your welcome voucher <strong className="text-[#EFECE6]">WELCOME10</strong> has been applied to your session.
            </p>
            <span className="text-[11px] text-[#8C7A5B] font-semibold">
              Check your inbox for private showroom access.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your confidential email..."
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-gray-500 outline-none focus:border-[#8C7A5B] transition-colors"
            />
            <button
              type="submit"
              className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8C7A5B] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-[#8C7A5B]/10"
            >
              <span>Join Atelier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-gray-500 mt-4 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-[#8C7A5B]" />
          <span>Strict privacy protocol. Zero unsolicited correspondence. Unsubscribe anytime.</span>
        </p>
      </div>
    </section>
  );
}
