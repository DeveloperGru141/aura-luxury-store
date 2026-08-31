import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductEditForm from './ProductEditForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product, error: prodErr }, { data: categories }] = await Promise.all([
    supabase.from('products').select('id, name, slug, description, price, category_id, images, stock_status').eq('id', id).single(),
    supabase.from('categories').select('id, name, slug').order('name'),
  ]);

  if (prodErr || !product) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Edit product</h1>
        <p className="mt-1 text-sm text-gray-500 font-mono">{product.slug} — stock and slug are not editable here.</p>
      </div>
      <ProductEditForm product={product as any} categories={categories ?? []} />
    </div>
  );
}
