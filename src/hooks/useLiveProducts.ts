'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Product, ProductCategory } from '@/types/store';

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
  categories?: { name: string; slug: string } | null;
};

const CATEGORY_META: Record<string, { tagline: string; image: string }> = {
  clothes: {
    tagline: 'Silk Gowns, Virgin Wool Tailoring & Knitwear',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
  },
  bags: {
    tagline: 'Hand-stitched Full-Grain Ilorin Leathers & Satchels',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
  },
  shoes: {
    tagline: 'Sculpted Stiletto Heels & Blake-Stitched Loafers',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
  },
  wristwatches: {
    tagline: 'Ilorin Automatic Calibres & Master Chronometers',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
  },
  watches: {
    tagline: 'Ilorin Automatic Calibres & Master Chronometers',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
  },
  jewelry: {
    tagline: '18k Solid Gold, Platinum & Certified Diamonds',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
  },
  apparel: {
    tagline: 'Silk Gowns, Virgin Wool Tailoring & Knitwear',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
  },
};

function mapSupabaseToProduct(row: SupabaseProductRow): Product {
  const categorySlug = row.categories?.slug ?? 'bags';
  const categoryLabelMap: Record<string, string> = {
    clothes: 'Wears',
    bags: 'Designer Bags',
    shoes: 'Luxury Shoes',
    wristwatches: 'Wristwatches',
    watches: 'Wristwatches',
    jewelry: 'Fine Jewelry',
    apparel: 'Wears',
  };
  const slugToCategory: Record<string, ProductCategory> = {
    clothes: 'apparel',
    bags: 'bags',
    shoes: 'shoes',
    wristwatches: 'watches',
    watches: 'watches',
    jewelry: 'jewelry',
    apparel: 'apparel',
  };
  const category: ProductCategory = slugToCategory[categorySlug] ?? 'bags';

  const rawTagline = row.description ?? '';
  const tagline = rawTagline.length > 60 ? rawTagline.slice(0, 60).trimEnd().replace(/\s+\S*$/, '') + '…' : rawTagline;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category,
    categoryLabel: row.categories?.name ?? categoryLabelMap[categorySlug] ?? categorySlug,
    tagline,
    description: row.description ?? '',
    price: Number(row.price),
    rating: 5.0,
    reviewCount: 0,
    primaryImage: row.images?.[0] ?? 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: row.images?.[1] ?? row.images?.[0] ?? 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    colors: [{ name: 'Default', hex: '#1a1a1a' }],
    materials: [],
    inStock: row.stock_status === 'in_stock',
    specs: [],
    ...(row as any),
  } as unknown as Product;
}

export function useLiveProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchLive = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('id, name, slug, description, price, category_id, images, stock_status, created_at, categories(name, slug)')
          .order('created_at', { ascending: false });

        if (cancelled) return;

        if (!error && data) {
          const mapped = (data as unknown as SupabaseProductRow[]).map(mapSupabaseToProduct);
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLive();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products: products ?? [], loading, isLive: products !== null };
}

export function useLiveCategories() {
  const [categories, setCategories] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchLive = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('categories').select('id, name, slug, image_url').order('created_at');
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          const mapped = data.map((c: any) => ({
            id: c.slug,
            name: c.name,
            tagline: CATEGORY_META[c.slug]?.tagline ?? '',
            count: '',
            image: c.image_url ?? CATEGORY_META[c.slug]?.image ?? '',
          }));
          setCategories(mapped);
        } else {
          setCategories([]);
        }
      } catch {
        if (!cancelled) setCategories([]);
      }
    };
    fetchLive();
    return () => {
      cancelled = true;
    };
  }, []);

  return categories ?? [];
}
