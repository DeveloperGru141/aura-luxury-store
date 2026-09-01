# Omo Esho Signatures — Site-Wide De-Templating / Humanization Audit Punch List

**Project:** Omo Esho Signatures (Next.js + Supabase)
**Audit Date:** 2026-09-01
**Scope:** Entire live storefront (Hero → Footer)

---

## Summary
**25 findings total** — 14 "fix directly" / 11 "needs confirmation"

The site is a clean monochrome Next.js/Tailwind v4 build but leans heavily on generic "quiet luxury" template patterns: stock Unsplash imagery, unverifiable hero stats, copy like "meticulously crafted garments designed to bring out your individuality," and a full template block sequence (promo bar → hero+metrics → brand strip → tabbed grid → 3 icon cards → overlapping newsletter → footer).

---

## 1. Visual / Palette

| # | Finding | Section | Label | Notes |
|---|---------|---------|-------|-------|
| 1 | **Glassmorphism overload** — `.glass-panel` and `.glass-nav` used across Hero, ShopTheLook, CategoryGrid cards, modals, nav, footer. Every surface is frosted-glass; no visual hierarchy. | Globals, Hero, ShopTheLook, CategoryGrid, modals, Navbar, Footer | fix directly | Reduce to 1–2 strategic uses (e.g., hero overlay card only). Replace others with solid `bg-[#13161C]` + subtle border. |
| 2 | **No design tokens for radius/spacing/container** — All values hardcoded in components (`rounded-xl`, `rounded-2xl`, `rounded-3xl`, `gap-3`, `gap-4`, `max-w-7xl`). No CSS custom properties for system tokens. | `globals.css`, all components | fix directly | Add `--radius-sm`, `--radius-md`, `--radius-lg`, `--space-*`, `--container-*` to `@theme` in `globals.css`. Migrate components. |
| 3 | **Uniform shadow system missing** — Components use ad-hoc `shadow-lg`, `shadow-2xl`, `shadow-xl`, `shadow-md` with no semantic meaning (elevation vs. glow vs. focus). | All sections | fix directly | Define 3 semantic shadows: `--shadow-elev-1`, `--shadow-elev-2`, `--shadow-glow-gold`. Apply consistently. |
| 4 | **Gold gradient text (`gold-gradient-text`) overused** — On Hero H1, CategoryGrid H2, FeaturedProducts H2, ShopTheLook H2, BrandPillars icons, FlashDrop H2, Footer brand. Every section heading uses it. | Hero, CategoryGrid, FeaturedProducts, ShopTheLook, BrandPillars, FlashDrop, Footer | fix directly | Reserve for 1–2 hero-level headings only. Use plain `text-white` or `text-[#D4AF37]` for section titles. |
| 5 | **Blurred gradient orbs (purple/blue tell)** — Hero has two `bg-[#D4AF37]/5 rounded-full blur-[120px]` orbs; ShopTheLook has two more; FlashDrop has one. Pure template pattern. | Hero, ShopTheLook, FlashDrop | fix directly | Remove all. Replace with subtle vignette or solid color blocks tied to brand. |
| 6 | **Colored left-border accent bars cycling without meaning** — CategoryGrid cards get gold border on hover/active; FeaturedProducts tabs get gold gradient; ProductCard gets gold border on hover. Inconsistent semantics. | CategoryGrid, FeaturedProducts tabs, ProductCard | fix directly | Standardize: gold border = primary interactive state only. Remove from tabs (use background fill instead). |

---

## 2. Typography

| # | Finding | Section | Label | Notes |
|---|---------|---------|-------|-------|
| 7 | **Body text falls back to Arial/system sans** — `globals.css` sets `--font-sans: var(--font-sans), system-ui...` but `Plus_Jakarta_Sans` is only loaded in `layout.tsx`. If font fails, body renders in Arial. No `font-sans` class on `<body>`. | `layout.tsx`, `globals.css` | fix directly | Add `className="font-sans"` to `<body>` in `layout.tsx`. Verify font loads via `next/font` preload. |
| 8 | **No typographic scale** — Heading sizes jump: Hero `text-5xl` → CategoryGrid `text-3xl` → FeaturedProducts `text-4xl` → ShopTheLook `text-3xl` → BrandPillars `text-base` → FlashDrop `text-4xl`. No consistent rhythm. | All sections | fix directly | Define `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-body-lg`, `--text-body`, `--text-caption` in `@theme`. Migrate. |
| 9 | **Italic-serif accent words ("in Ilorin")** — Used in Hero H1, CategoryGrid H2, FeaturedProducts H2, ShopTheLook H2, FlashDrop H2, Footer brand. Pattern is identical everywhere. | Hero, CategoryGrid, FeaturedProducts, ShopTheLook, FlashDrop, Footer | needs confirmation | Is this a deliberate brand signature (tied to serif wordmark) or an AI default? If brand, keep but limit to hero + 1 other. If default, remove from section headings. |
| 10 | **ALL-CAPS eyebrow labels on stats** — "HANDCRAFTED IN ILORIN", "WORLDWIDE INSURED DELIVERY" in Hero and ShopTheLook. These are decorative badges, not live data. | Hero, ShopTheLook | fix directly | Replace with live metrics (order count, return rate, NPS) or remove. If kept, make them real data points. |

---

## 3. Layout & Component Patterns

| # | Finding | Section | Label | Notes |
|---|---------|---------|-------|-------|
| 11 | **Generic template block sequence** — Page follows: AnnouncementBar → Hero+metrics → CategoryGrid (5-card bento) → FeaturedProducts (tabbed grid) → ShopTheLook (7/5 split carousel) → BrandPillars (4 icon cards) → FlashDrop (countdown + image) → CustomerReviews (3 cards) → Footer. Exactly the "quiet luxury" template. | `page.tsx` | fix directly | Reorder/remove blocks that don't serve this specific catalogue. Combine CategoryGrid + FeaturedProducts into one filterable catalogue. Remove BrandPillars if redundant with TrustStrip (missing). |
| 12 | **Eyebrow badges above section headings without real info** — "Explore by category", "The catalogue", "Curated lookbook", "What clients say", "Midnight Vault". None convey unique value; all are decorative. | CategoryGrid, FeaturedProducts, ShopTheLook, CustomerReviews, FlashDrop | fix directly | Remove eyebrows. Let section heading + subhead do the work. |
| 13 | **Cards nested inside cards with compounding shadows** — Hero desktop: carousel card (shadow-2xl) inside section container (border) inside gold-border accent (`-bottom-3 -right-3`). ShopTheLook: image card (shadow-2xl) + sidebar card (shadow-2xl) inside grid. CategoryGrid: image + vignette + border + hover ring. | Hero, ShopTheLook, CategoryGrid | fix directly | Flatten: one elevation per component. Remove outer decorative borders (e.g., Hero's `-bottom-3 -right-3` accent card). |
| 14 | **Tabbed catalogue uses scroll-snap but no keyboard navigation** — FeaturedProducts tabs are `button` but no arrow-key handling for horizontal scroll on mobile. | FeaturedProducts | fix directly | Add `onKeyDown` for ArrowLeft/Right. Ensure focus ring visible. |
| 15 | **ProductCard used in SearchModal results but wrapped in extra `div`** — SearchModal wraps each `ProductCard` in `group flex flex-col rounded-xl bg-white/[0.03]...` adding redundant border/background. | SearchModal | fix directly | Use `ProductCard` directly. Remove wrapper. |

---

## 4. Copy & Voice

| # | Finding | Section | Label | Notes |
|---|---------|---------|-------|-------|
| 16 | **Generic "aspirational" phrasing site-wide** — "meticulously crafted", "designed to bring out your individuality", "unrivaled craftsmanship", "true work of horological art", "exquisite diamond brilliance", "radiant sparkle". Zero concrete detail. | Hero, CategoryGrid subhead, ShopTheLook, CustomerReviews (all 3), FlashDrop | fix directly | Replace with specifics: atelier name, material lot #, calibre spec, gold weight, production run size, courier name, insurance provider. |
| 17 | **Unverifiable stats/badges beyond Hero** — CustomerReviews shows "4.9 out of 5 from over 2,400 verified orders" — hardcoded in component, not from Supabase. FlashDrop "Only 25 numbered pieces" — hardcoded timer resets at 24h. | CustomerReviews, FlashDrop | needs confirmation | Are these real? If yes, wire to Supabase. If no, remove or label "illustrative". |
| 18 | **Category descriptions use template phrasing** — CategoryGrid: "Five houses: leather bags stitched in Ilorin, silk wears cut in Ilorin, shoes lasted in Marche, Ilorin calibres from Ilorin, and 18k jewelry — each restocked in small runs." Good but could name the specific ateliers. | CategoryGrid | needs confirmation | Can we name the specific workshops (e.g., "Ojo Atelier, Ilorin" vs generic "stitched in Ilorin")? |
| 19 | **ProductCard tagline truncates at 60 chars** — `tagline: row.description?.slice(0, 60)` cuts mid-sentence. No ellipsis handling for RTL. | `useLiveProducts.ts`, ProductCard | fix directly | Use proper truncation with ellipsis. Show full description on hover/quick-view. |
| 20 | **WhatsApp concierge copy is generic** — "Direct Client Orders & Inquiries", "Chat with Concierge". No human name, response time, or language. | AnnouncementBar, Navbar drawer, Footer, FlashDrop, empty states | needs confirmation | Can we add: "Chidi replies in <2h (English/Yoruba)" or similar human detail? |

---

## 5. Motion & Interaction

| # | Finding | Section | Label | Notes |
|---|---------|---------|-------|-------|
| 21 | **Auto-advance carousels without pause-on-hover on desktop** — Hero (4.5s), ShopTheLook (4s) auto-advance even when user is reading. Only Hero respects `prefers-reduced-motion`. | Hero, ShopTheLook | fix directly | Add `onMouseEnter`/`onMouseLeave` to pause timer on desktop. Keep auto-advance on mobile only. |
| 22 | **Mobile Ken Burns / crossfade animations forced on all images** — `mobileProductPrimary`/`Secondary` (7s) and `mobileKenBurns` (12s) run on every product/category image on mobile via media query. No user control. | `globals.css` (lines 286–303), ProductCard, CategoryGrid | needs confirmation | Is constant motion desired? Consider `prefers-reduced-motion` opt-out or toggle in settings. |
| 23 | **Marquee ticker in globals.css but not used** — `.animate-marquee` (32s linear) exists but no component uses it. Dead code. | `globals.css` | fix directly | Remove or implement if needed for AnnouncementBar. |
| 24 | **Focus-visible only on mobile** — `@media (max-width: 640px) :focus-visible` exists but desktop has no focus styles. Keyboard users on desktop get no feedback. | `globals.css` (lines 363–369) | fix directly | Remove media query. Apply `:focus-visible` globally with gold outline. |

---

## 6. Imagery

| # | Finding | Section | Label | Notes |
|---|---------|---------|-------|-------|
| 25 | **100% stock Unsplash photography** — Every image (Hero slides, CategoryGrid, ShopTheLook, FlashDrop, CustomerReviews avatars/products) is from Unsplash. Zero actual product photography. Lighting/crop inconsistent. | All sections | needs confirmation | Budget/plan for actual atelier/product photography. If not possible, curate a consistent style set (same photographer, lighting, background). |
| 26 | **CustomerReview avatars use product images, not people** — Each review shows the product photo in the author avatar circle. Misleading. | CustomerReviews | fix directly | Use actual customer photos (with permission) or generic avatar placeholder. |

---

## 7. Trust Signals

| # | Finding | Section | Label | Notes |
|---|---------|---------|-------|-------|
| 27 | **WhatsApp concierge lacks human detail** — Phone number only. No name, no response SLA, no language info, no photo. | AnnouncementBar, Navbar drawer, Footer, FlashDrop, empty states | needs confirmation | Add: "Chidi • replies in <2h • English & Yoruba" or similar. |
| 28 | **Courier/insurance claims vague** — "worldwide insured courier", "insured delivery", "signature required" — no carrier name (DHL? FedEx? Aramex?), no insurance provider, no claims process. | Hero stats, BrandPillars pillar 1, Footer, FlashDrop | needs confirmation | Replace with specifics: "DHL Express + AIG insured to ₦5M", "Aramex next-day Ilorin, 2–3 days NG". |
| 29 | **No TrustStrip section** — BrandPillars exists but no dedicated trust strip with logos/certs. "Certificates included" pillar says "atelier card and material certificate" but no visual proof. | Missing section | needs confirmation | Add TrustStrip with: DHL logo, AIG logo, "NIS certified", "Made in Nigeria" badge, atelier photos. |

---

## Fix Priority Order

1. **Design tokens** (radius, spacing, shadows, type scale) — enables all other fixes
2. **Remove gradient orbs + reduce glassmorphism** — biggest visual tells
3. **Typography scale + font-sans on body** — readability foundation
4. **Copy humanization** (remove generic phrasing, add specifics) — brand voice
5. **Flatten nested cards** — visual hierarchy
6. **Wire real data to stats** (reviews count, FlashDrop inventory) — trust
7. **Focus-visible globally + keyboard nav** — accessibility
7. **Humanize WhatsApp concierge** — trust signal
8. **Pause carousels on hover** — UX
9. **Photography plan** — long-term brand asset

---

## Files to Touch (for fixes)

| File | Fixes |
|------|-------|
| `src/app/globals.css` | 2, 3, 4, 5, 6, 8, 9, 10, 21, 22, 23, 24 |
| `src/app/layout.tsx` | 7 |
| `src/app/page.tsx` | 11 |
| `src/components/sections/HeroSection.tsx` | 1, 4, 5, 9, 10, 13, 16, 21 |
| `src/components/sections/CategoryGrid.tsx` | 1, 4, 6, 11, 12, 13, 16, 18 |
| `src/components/sections/FeaturedProducts.tsx` | 4, 6, 11, 12, 14 |
| `src/components/sections/ShopTheLook.tsx` | 1, 4, 5, 9, 10, 13, 16, 21, 22 |
| `src/components/sections/BrandPillars.tsx` | 4, 11, 12 |
| `src/components/sections/FlashDropBanner.tsx` | 4, 5, 10, 16, 17 |
| `src/components/sections/CustomerReviews.tsx` | 10, 16, 17, 25 |
| `src/components/layout/AnnouncementBar.tsx` | 20, 27 |
| `src/components/layout/Navbar.tsx` | 20, 27 |
| `src/components/layout/Footer.tsx` | 4, 9, 20, 27, 28 |
| `src/components/ui/ProductCard.tsx` | 19, 22 |
| `src/hooks/useLiveProducts.ts` | 19 |
| `src/context/StoreContext.tsx` | — (provides WhatsApp URL) |

---

## Notes for Stakeholder Review

The following items need a decision before fixing:

1. **Italic-serif accent words** — Brand signature or AI default?
2. **CustomerReviews stats (4.9/5, 2,400 orders)** — Real data or illustrative?
3. **FlashDrop "25 pieces" timer** — Real inventory or marketing device?
4. **Category atelier names** — Can we name specific workshops?
5. **WhatsApp concierge human detail** — Can we publish a name/SLA?
6. **Courier/insurance specifics** — Can we name DHL/AIG/Aramex?
7. **Mobile auto-animations** — Desired or intrusive?
8. **Photography budget** — Timeline for real imagery?

---