'use client';

import ScrollReveal from './ScrollReveal';
import ProductCard from './ui/ProductCard';
import type { Product } from '@/types/store';
import { useLiveProducts } from '@/hooks/useLiveProducts';

interface ProductGridProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
}

/**
 * OMO ESHO SIGNATURES ProductGrid — 2-col mobile / 4-col desktop, staggered ScrollReveal
 * Layout: mobile-first fluid gaps, luxury spacing, snap wave entry
 *
 * Stagger math: (index % 4) * 0.05 → 0s, 0.05s, 0.10s, 0.15s per row
 * creates a wave that resets each row (4-col). Feels premium, not jarring.
 */
export default function ProductGrid({
  products,
  title = 'Curated Wears',
  subtitle = 'Hand-stitched leather, silk drape & Swiss precision — revealed as you scroll.',
}: ProductGridProps) {
  const { products: liveProducts } = useLiveProducts();
  const displayProducts = products ?? liveProducts.slice(0, 8);
  return (
    <section id="product-grid-demo" className="py-12 sm:py-16 lg:py-20 bg-[#0E1117] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — itself revealed as a block */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="font-serif text-[28px] sm:text-4xl lg:text-5xl font-light text-white leading-tight">
            {title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="italic font-normal gold-gradient-text">{title.split(' ').slice(-1)}</span>
          </h2>
          <p className="mt-3 text-[13px] sm:text-sm text-gray-400 font-light leading-relaxed">{subtitle}</p>
        </ScrollReveal>

        {/* Grid: 2-col mobile (tight, fluid) / 4-col desktop (luxury breathing room) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {displayProducts.map((product, index) => {
            // Dynamic stagger: wave per row, resets every 4 (desktop) — 50ms steps
            const stagger = (index % 4) * 0.05; // 0, 0.05, 0.10, 0.15 → 150ms max lift per row

            return (
              <ScrollReveal key={product.id} delay={stagger} className="h-full">
                <ProductCard product={product} />
              </ScrollReveal>
            );
          })}
        </div>

        {/* Optional: reveal CTA after grid */}
        <ScrollReveal delay={0.2} className="mt-8 sm:mt-10 flex justify-center">
          <a
            href="#catalogue"
            className="inline-flex min-h-[44px] items-center justify-center px-6 sm:px-8 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 active:scale-[0.98] transition-all touch-manipulation"
          >
            View All Wears
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USAGE — drop into any page, e.g. app/page.tsx:
//
// import ProductGrid from '@/components/ProductGrid';
//
// export default function Page() {
//   return (
//     <main>
//       <HeroSection />
//       <ProductGrid />  // ← 2-col mobile / 4-col desktop, 50ms wave stagger
//       <ShopTheLook />
//     </main>
//   );
// }
//
// Each card lifts only 24px (translate-y-6) over 0.8s with
// cubic-bezier(0.16,1,0.3,1) — deceleration feels snappy yet decelerated,
// will-change promotes to GPU once, observer.unobserve() ensures once-only.
// ─────────────────────────────────────────────────────────────────────────────
