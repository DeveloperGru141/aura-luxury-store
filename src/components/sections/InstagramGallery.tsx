import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    handle: '@clara.vogue',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    caption: 'Carrying the iconic Monceau croc leather satchel on the streets of Ilorin ✨👜',
    productTag: 'Monceau Croc Satchel',
  },
  {
    id: 'ig-2',
    handle: '@julian_lifestyle',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    caption: 'Fastening the Chronographe Imperial rose gold timepiece before the gala ⌚🤵',
    productTag: 'Chronographe Imperial',
  },
  {
    id: 'ig-3',
    handle: '@nina.stiletto',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    caption: 'Stepping into the weekend in the Venice sculpted ankle-strap pumps 👠✨',
    productTag: 'Venice Ankle-Strap Pumps',
  },
  {
    id: 'ig-4',
    handle: '@marcus.lux',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
    caption: 'The Grand Nautique 300M on wrist & ready for the weekend voyage ⌚🌊',
    productTag: 'Grand Nautique Diver',
  },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function InstagramGallery() {
  return (
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 bg-[#0A0C0F] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — fluid */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 lg:mb-12 px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-gray-300 text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">
            <InstagramIcon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>@OMO ESHO SIGNATURESLuxury</span>
          </div>
          <h2 className="font-serif text-[24px] sm:text-3xl lg:text-4xl font-light text-white mb-2 leading-tight">
            The Living <span className="italic font-normal gold-gradient-text">Lookbook</span>
          </h2>
          <p className="text-[13px] sm:text-xs text-gray-400 font-light leading-relaxed">
            Tag #OMO ESHO SIGNATURESLuxury on Instagram for an opportunity to be featured in our seasonal global lookbook.
          </p>
        </div>

        {/* 4-Image Grid — fluid gaps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-white/5 hover:border-[#D4AF37]/40 active:scale-[0.98] transition-all cursor-pointer touch-manipulation"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="mobile-category-img object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Mobile Ambient Badge — visible on touch screens */}
              <div className="absolute inset-x-2 bottom-2 z-10 sm:hidden flex flex-col gap-1 pointer-events-none">
                <div className="p-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 shadow-lg">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-[#D4AF37] truncate">{post.handle}</span>
                    <ArrowUpRight className="w-3 h-3 text-white/80 shrink-0" />
                  </div>
                  <span className="text-[9px] text-gray-300 truncate block mt-0.5 font-light">
                    {post.productTag}
                  </span>
                </div>
              </div>

              {/* Desktop Full Hover Overlay */}
              <div className="hidden sm:flex absolute inset-0 bg-black/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex-col justify-between text-white">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#D4AF37]">{post.handle}</span>
                  <div className="p-1.5 rounded-full bg-white/10 text-white group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-gray-300 line-clamp-2 mb-2 font-light">
                    {post.caption}
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#F3E5AB] text-[10px] font-semibold">
                    Shop {post.productTag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
