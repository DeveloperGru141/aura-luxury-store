'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Product, ProductCategory } from '@/types/store';
import { PRODUCTS as MOCK_PRODUCTS, CATEGORIES as MOCK_CATEGORIES } from '@/data/mockData';

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

function mapSupabaseToProduct(row: SupabaseProductRow): Product {
  const categorySlug = row.categories?.slug ?? 'bags';
  const categoryLabelMap: Record<string, string> = {
    clothes: 'Wears',
    bags: 'Designer Bags',
    shoes: 'Luxury Shoes',
    wristwatches: 'Wristwatches',
    jewelry: 'Fine Jewelry',
    apparel: 'Wears',
  };
  const category: ProductCategory = (['bags', 'apparel', 'shoes', 'watches', 'jewelry'].includes(categorySlug)
    ? (categorySlug === 'clothes' ? 'apparel' : categorySlug === 'wristwatches' ? 'watches' : (categorySlug as ProductCategory))
    : 'bags') as ProductCategory;

  return {
    id: row.id,
    name: row.name,
    category,
    categoryLabel: row.categories?.name ?? categoryLabelMap[categorySlug] ?? categorySlug,
    tagline: row.description?.slice(0, 60) ?? '',
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
    // carry supabase fields for out-of-stock badge
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

        if (!error && data && data.length > 0) {
          const mapped = (data as unknown as SupabaseProductRow[]).map(mapSupabaseToProduct);
          setProducts(mapped);
        } else {
          // Fallback to mock when live empty or error
          setProducts(MOCK_PRODUCTS);
        }
      } catch {
        if (!cancelled) setProducts(MOCK_PRODUCTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLive();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products: products ?? MOCK_PRODUCTS, loading, isLive: products !== null && products !== MOCK_PRODUCTS };
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
          // Map to mock shape
          const mapped = data.map((c: any) => ({
            id: c.slug,
            name: c.name,
            tagline: '',
            count: '',
            image: c.image_url ?? MOCK_CATEGORIES.find((m) => m.id === c.slug)?.image ?? '',
          }));
          setCategories(mapped);
        } else {
          setCategories(MOCK_CATEGORIES);
        }
      } catch {
        if (!cancelled) setCategories(MOCK_CATEGORIES);
      }
    };
    fetchLive();
    return () => {
      cancelled = true;
    };
  }, []);

  return categories ?? MOCK_CATEGORIES;
}
