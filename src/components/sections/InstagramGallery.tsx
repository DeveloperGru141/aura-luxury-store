import React from 'react';
import Image from 'next/image';
import { INSTAGRAM_POSTS } from '@/data/mockData';
import { ArrowUpRight, Camera } from 'lucide-react';

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
    <section id="gallery" className="py-20 bg-[#0A0C0F] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <InstagramIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>@TimelessLuxury</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-light text-white mb-2">
            The Living <span className="italic font-normal gold-gradient-text">Lookbook</span>
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Tag #TimelessLuxury on Instagram for an opportunity to be featured in our seasonal global lookbook.
          </p>
        </div>

        {/* 4-Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-white/5 cursor-pointer"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#D4AF37]">{post.handle}</span>
                  <div className="p-1.5 rounded-full bg-white/10 text-white">
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
