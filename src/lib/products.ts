import { createClient } from '@/lib/supabase/server';

export type SupabaseProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  category_id: string;
  images: string[];
  stock_status: 'in_stock' | 'out_of_stock';
  created_at: string;
  categories?: { name: string; slug: string } | null;
};

// Note: Supabase filter-on-join has sharp edges — verify server-side filtering.
// We first resolve category_id, then filter products by category_id to ensure server-side filtering.

export async function getProductsByCategory(categorySlug: string) {
  const supabase = await createClient();

  // Resolve category id first
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (catError || !category) {
    // Fallback: try direct join filter (may return all if join filter fails)
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('categories.slug', categorySlug);
    if (error) throw error;
    return data as SupabaseProduct[];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('category_id', category.id);

  if (error) throw error;
  return data as SupabaseProduct[];
}

export async function getAllProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*, categories(name, slug)').order('created_at', { ascending: false });
  if (error) throw error;
  return data as SupabaseProduct[];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*, categories(name, slug)').eq('slug', slug).single();
  if (error) throw error;
  return data as SupabaseProduct;
}
