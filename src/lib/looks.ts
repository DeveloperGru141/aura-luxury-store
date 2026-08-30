import { createClient } from '@/lib/supabase/server';

export async function getLooksByPlacement(placement: 'hero' | 'lookbook') {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('looks')
    .select('*, look_products(product_id, products(*, categories(name, slug)))')
    .eq('placement', placement)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}
