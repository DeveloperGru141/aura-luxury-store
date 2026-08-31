'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
  description: string;
  linkedProductUrl?: string;
}

const ROLEX_VIDEO: VideoItem = {
  id: 'rolex-01',
  title: 'Rolex Oyster Perpetual / Datejust Signature Showcase',
  videoUrl: '/craftsmanship.mp4',
  posterUrl: '/images/rolex-poster.jpg',
  description:
    'Featured in our private Ilorin collection: an iconic automatic movement housed in 904L Oystersteel with a sunray dial. Inspected, timed, and verified by our horological specialists for power reserve reliability and chronometric precision.',
  linkedProductUrl:
    'https://wa.me/2347065076565?text=Hi%20OMO%20ESHO%20SIGNATURES%2C%20I%20would%20like%20to%20make%20an%20inquiry%20regarding%20the%20featured%20Rolex%20timepiece.',
};

export default function VideoShowcase({ videos }: { videos?: VideoItem[] }) {
  const video = videos?.[0] ?? ROLEX_VIDEO;
  const ref = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Battery-efficient: pause when off-screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: [0, 0.25, 0.5], rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    const onVis = () => {
      if (document.hidden) el.pause();
      else if (!document.hidden && el.getBoundingClientRect().top < window.innerHeight) el.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    if (!ref.current) return;
    if (isPlaying) {
      ref.current.pause();
      setIsPlaying(false);
    } else {
      ref.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <section id="atelier" className="bg-[#FAF8F5] text-[#1A1918] py-10 sm:py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow + Heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-8 sm:mb-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E2DDD5] px-3 py-1 text-[10px] font-semibold tracking-wide text-[#8C7A5B]">
            HOROLOGY & CRAFTSMANSHIP
          </span>
          <h2 className="font-serif text-[26px] sm:text-3xl lg:text-[36px] font-light leading-tight tracking-tight text-[#1A1918] mt-3">
            Precision in Motion: <span className="italic font-normal text-[#8C7A5B]">The Swiss Automatic Calibre</span>
          </h2>
        </motion.div>

        {/* Editorial split: 7 + 5 desktop, stacked mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left: Large video */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[#E2DDD5] bg-[#121212] aspect-[4/5] sm:aspect-[16/9] md:aspect-[16/9] lg:aspect-[4/3]">
              <video
                ref={ref}
                src={video.videoUrl}
                poster={video.posterUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
              {/* Controls — desktop */}
              <div className="absolute top-3 right-3 hidden sm:flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="h-9 w-9 rounded-full bg-white/90 backdrop-blur text-[#121212] flex items-center justify-center hover:bg-white active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="h-9 w-9 rounded-full bg-[#121212]/70 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-[#121212]/90 active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
              {/* Mobile tap overlay */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 active:bg-black/10 sm:hidden"
                aria-label={isMuted ? 'Tap to unmute' : 'Tap to mute'}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-[#1A1918] shadow-lg">
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  {isMuted ? 'Tap to Unmute' : 'Tap to Mute'}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Right: Editorial spec card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 flex"
          >
            <div className="flex flex-col w-full rounded-2xl border border-[#E2DDD5] bg-[#EFECE6] p-5 sm:p-6">
              <span className="text-[10px] font-semibold tracking-wide text-[#8C7A5B]">FEATURED TIMEPIECE</span>
              <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1A1918] leading-tight mt-2">{video.title}</h3>
              <p className="text-sm text-[#5C5852] leading-relaxed mt-3">{video.description}</p>

              <dl className="mt-5 grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start justify-between gap-4 rounded-xl bg-white border border-[#E2DDD5] px-3.5 py-3">
                  <dt className="text-xs font-medium text-[#7A756E]">Calibre</dt>
                  <dd className="text-xs font-semibold text-[#1A1918] text-right">Swiss Automatic Self-Winding</dd>
                </div>
                <div className="flex items-start justify-between gap-4 rounded-xl bg-white border border-[#E2DDD5] px-3.5 py-3">
                  <dt className="text-xs font-medium text-[#7A756E]">Case</dt>
                  <dd className="text-xs font-semibold text-[#1A1918] text-right">904L Oystersteel / Fluted Bezel</dd>
                </div>
                <div className="flex items-start justify-between gap-4 rounded-xl bg-white border border-[#E2DDD5] px-3.5 py-3">
                  <dt className="text-xs font-medium text-[#7A756E]">Condition</dt>
                  <dd className="text-xs font-semibold text-[#1A1918] text-right inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#8C7A5B]" /> Verified Authentic • Atelier Certified</dd>
                </div>
                <div className="flex items-start justify-between gap-4 rounded-xl bg-white border border-[#E2DDD5] px-3.5 py-3">
                  <dt className="text-xs font-medium text-[#7A756E]">Dispatch</dt>
                  <dd className="text-xs font-semibold text-[#1A1918] text-right inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#8C7A5B]" /> Same-Day Ilorin Dispatch • Insured Nationwide Delivery</dd>
                </div>
              </dl>

              <a
                href={video.linkedProductUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1A1918] text-white px-5 py-3.5 text-xs font-semibold tracking-wide hover:bg-[#2A2928] active:scale-[0.97] transition-transform min-h-[44px]"
              >
                <MessageCircle className="h-4 w-4" />
                Inquire via Concierge for Pricing & Availability
              </a>
              <p className="text-[11px] text-[#7A756E] mt-2.5 text-center">Private Ilorin collection • Response under 15 mins</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
