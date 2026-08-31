'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, X, ExternalLink, Sparkles, Scissors, Watch, Shirt } from 'lucide-react';

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  posterUrl: string;
  description: string;
  linkedProductUrl?: string;
}

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'craft-01',
    title: 'Hand-burnishing the edge',
    category: 'Leather Bags',
    videoUrl: '/craftsmanship.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    description: 'Florence atelier — 7 coats of wax, edge creasing and hand-painted finish on full-grain calfskin.',
    linkedProductUrl: '#catalogue',
  },
  {
    id: 'craft-02',
    title: 'Calibre assembly',
    category: 'Swiss Wristwatches',
    videoUrl: '/craftsmanship.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    description: 'Geneva — automatic calibre, 28,800 vph, perlage and blued screws under sapphire.',
    linkedProductUrl: '#catalogue',
  },
  {
    id: 'craft-03',
    title: 'Silk bias cut',
    category: 'Wears — Como',
    videoUrl: '/craftsmanship.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    description: 'Como silk — bias-cut drape, French seams and invisible hemming on 22-momme mulberry.',
    linkedProductUrl: '#catalogue',
  },
];

function useInViewPlay(videoRef: React.RefObject<HTMLVideoElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoRef, enabled]);
}

function VideoCard({
  item,
  featured,
  onExpand,
}: {
  item: VideoItem;
  featured?: boolean;
  onExpand: (v: VideoItem) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  useInViewPlay(ref, true);

  useEffect(() => {
    if (ref.current) ref.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    if (!ref.current) return;
    if (isPlaying) { ref.current.pause(); setIsPlaying(false); }
    else { ref.current.play().catch(()=>{}); setIsPlaying(true); }
  };

  return (
    <div
      className={`group relative overflow-hidden bg-[#121212] border border-[#E8DDD0] touch-manipulation ${
        featured ? 'rounded-[20px] lg:rounded-[28px] aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]' : 'rounded-2xl aspect-[4/3] sm:aspect-[3/4]'
      }`}
      onClick={() => onExpand(item)}
    >
      <video
        ref={ref}
        src={item.videoUrl}
        poster={item.posterUrl}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
      {/* Tap-friendly controls */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10" onClick={(e)=>e.stopPropagation()}>
        <button
          onClick={togglePlay}
          className="h-9 w-9 rounded-full bg-white/90 backdrop-blur text-[#121212] flex items-center justify-center hover:bg-white active:scale-[0.97] transition-all"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="h-9 w-9 rounded-full bg-[#121212]/70 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-[#121212]/90 active:scale-[0.97] transition-all"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#121212] mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9A7B2C]" />
          {item.category}
        </span>
        <h3 className="font-serif text-base sm:text-lg font-medium text-white leading-tight">{item.title}</h3>
        <p className="text-xs text-white/80 leading-relaxed mt-1 line-clamp-2">{item.description}</p>
      </div>
    </div>
  );
}

export default function VideoShowcase({ videos = DEFAULT_VIDEOS }: { videos?: VideoItem[] }) {
  const [active, setActive] = useState<VideoItem | null>(null);
  const featured = videos[0];
  const previews = videos.slice(1);

  // Lock scroll when modal open
  useEffect(() => {
    if (active) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  return (
    <section id="atelier" className="bg-[#FDFBF7] text-[#121212] py-10 sm:py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — warm editorial, reduced letter-spacing */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-8 sm:mb-10"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-[#9A7B2C] mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Atelier notes — Ilorin & partners
          </span>
          <h2 className="font-serif text-[28px] sm:text-3xl lg:text-[36px] font-light leading-tight tracking-tight text-[#121212]">
            How a small run <span className="font-normal italic text-[#9A7B2C]">is made</span>
          </h2>
          <p className="text-sm text-[#5A5248] leading-relaxed mt-3 max-w-2xl">
            Three short clips from this month's run — no stock, no filters. Leather edge, calibre, silk. Each piece is cut and finished to order in runs of 25–50, then shipped insured from Ilorin.
          </p>
        </motion.div>

        {/* Desktop: 2-col split | Mobile: snap scroll */}
        {/* Mobile snap feed */}
        <div className="flex lg:hidden gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 pb-2">
          {[featured, ...previews].map((v) => (
            <div key={v.id} className="snap-start shrink-0 w-[84vw] max-w-[360px]">
              <VideoCard item={v} onExpand={setActive} />
            </div>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8"
          >
            {featured && <VideoCard item={featured} featured onExpand={setActive} />}
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#5A5248]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DDD0] bg-white px-3 py-1.5"><Scissors className="h-3.5 w-3.5 text-[#9A7B2C]" /> Full-grain calfskin — Florence</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DDD0] bg-white px-3 py-1.5"><Watch className="h-3.5 w-3.5 text-[#9A7B2C]" /> 72h power reserve — Geneva</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DDD0] bg-white px-3 py-1.5"><Shirt className="h-3.5 w-3.5 text-[#9A7B2C]" /> 22-momme silk — Como</span>
            </div>
          </motion.div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            {previews.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * (i + 1), ease: [0.16, 1, 0.3, 1] }}
                className="flex-1"
              >
                <VideoCard item={v} onExpand={setActive} />
              </motion.div>
            ))}
            {/* Spec callout instead of third video when only 2 previews */}
            {previews.length < 2 && (
              <div className="rounded-2xl border border-[#E8DDD0] bg-white p-5">
                <p className="text-xs font-semibold tracking-wide text-[#9A7B2C]">Lot no. 042 — Ilorin</p>
                <p className="font-serif text-base font-medium text-[#121212] mt-1">Packed for monsoon, not just photos</p>
                <p className="text-xs text-[#5A5248] leading-relaxed mt-2">Every shipment is humidity-checked, boxed in Ilorin, and handed to DHL/FedEx with insurance to Lagos, Abuja, Port Harcourt and beyond — tracking shared on WhatsApp within 2 hours.</p>
                <a href="https://wa.me/2347065076565?text=Hi%20Omo%20Esho%20Signatures,%20I%20would%20like%20to%20make%20an%20inquiry%20with%20the%20private%20client%20concierge." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#9A7B2C] hover:text-[#7A5F1E]">
                  Chat with Ilorin concierge — under 15 mins <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Spec callout for mobile */}
        <div className="lg:hidden mt-4 rounded-2xl border border-[#E8DDD0] bg-white p-4">
          <p className="text-xs font-semibold tracking-wide text-[#9A7B2C]">Lot no. 042 — Ilorin</p>
          <p className="text-sm font-medium text-[#121212] mt-1">Small run, not mass stock</p>
          <p className="text-xs text-[#5A5248] leading-relaxed mt-1">Cut to order, finished by hand. WhatsApp us for exact measurements, leather lot photos or calibre serial before you pay.</p>
        </div>
      </div>

      {/* Expanded modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-[#121212] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setActive(null)} className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black border border-white/10">
                <X className="h-4 w-4" />
              </button>
              <video src={active.videoUrl} poster={active.posterUrl} controls autoPlay playsInline className="w-full aspect-video bg-black" />
              <div className="p-5">
                <span className="text-xs font-medium tracking-wide text-[#D4AF37]">{active.category}</span>
                <h3 className="font-serif text-lg font-medium text-white mt-1">{active.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed mt-2">{active.description}</p>
                {active.linkedProductUrl && (
                  <a href={active.linkedProductUrl} onClick={() => setActive(null)} className="inline-flex items-center gap-1.5 mt-4 rounded-full bg-white text-[#121212] px-4 py-2 text-xs font-medium hover:bg-[#F3E5AB] transition-colors">
                    View linked piece <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
