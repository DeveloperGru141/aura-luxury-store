import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/store';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

type SupabaseProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  category_id: string;
  images: string[];
  stock_status: 'in_stock' | 'out_of_stock';
  created_at: string;
  categories?: { name: string; slug: string }[] | null;
};

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, category_id, images, stock_status, created_at, categories(name, slug)')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  const row = data as SupabaseProductRow;
  const categorySlug = row.categories?.[0]?.slug ?? 'bags';
  const categoryLabelMap: Record<string, string> = {
    clothes: 'Wears',
    bags: 'Designer Bags',
    shoes: 'Luxury Shoes',
    wristwatches: 'Wristwatches',
    watches: 'Wristwatches',
    jewelry: 'Fine Jewelry',
    apparel: 'Wears',
  };
  const slugToCategory: Record<string, string> = {
    clothes: 'apparel',
    bags: 'bags',
    shoes: 'shoes',
    wristwatches: 'watches',
    watches: 'watches',
    jewelry: 'jewelry',
    apparel: 'apparel',
  };
  const category = slugToCategory[categorySlug] ?? 'bags';

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category,
    categoryLabel: row.categories?.[0]?.name ?? categoryLabelMap[categorySlug] ?? categorySlug,
    tagline: row.description?.slice(0, 60) ?? '',
    description: row.description ?? '',
    price: Number(row.price),
    rating: 5.0,
    reviewCount: 0,
    primaryImage: row.images?.[0] ?? 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: row.images?.[1] ?? '',
    colors: [{ name: 'Default', hex: '#1a1a1a' }],
    materials: [],
    inStock: row.stock_status === 'in_stock',
    specs: [],
  } as Product;
}

async function getSiteUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  return host ? `${protocol}://${host}` : 'https://omosesho.com';
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | OMO ESHO SIGNATURES',
    };
  }

  const baseUrl = await getSiteUrl();
  const productUrl = `${baseUrl}/product/${slug}`;
  const imageUrl = product.primaryImage.startsWith('http') ? product.primaryImage : `${baseUrl}${product.primaryImage}`;

  return {
    title: `${product.name} | OMO ESHO SIGNATURES`,
    description: product.tagline || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.tagline || product.description.slice(0, 160),
      url: productUrl,
      siteName: 'OMO ESHO SIGNATURES',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.tagline || product.description.slice(0, 160),
      images: [imageUrl],
    },
    other: {
      'og:price:amount': product.price.toString(),
      'og:price:currency': 'NGN',
      'product:availability': product.inStock ? 'in_stock' : 'out_of_stock',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const baseUrl = await getSiteUrl();
  const productUrl = `${baseUrl}/product/${slug}`;
  const whatsappMessage = `Hi OMO ESHO SIGNATURES, I would like to inquire about this product:\n\nProduct: ${product.name}\nPrice: ${product.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })}\n\n${productUrl}\n\nCould you please share more details regarding availability and how to proceed?`;

  return (
    <main className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--color-surface-alt)] border border-[var(--color-border)] shadow-sm">
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center py-2">
            <p className="text-xs uppercase tracking-widest font-bold text-[var(--color-accent-gold)] mb-2">{product.categoryLabel}</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--color-text-primary)] leading-tight mb-3">
              {product.name}
            </h1>
            <p className="text-base text-[var(--color-text-secondary)] font-light mb-4">{product.tagline}</p>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-6">
              {product.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })}
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)] font-light leading-relaxed mb-8 border-y border-[var(--color-border)] py-4">{product.description}</p>
            <a
              href={`https://wa.me/2347065076565?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] active:scale-[0.98] text-black font-semibold text-sm shadow-sm hover:shadow-md transition-all min-h-[48px]"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
