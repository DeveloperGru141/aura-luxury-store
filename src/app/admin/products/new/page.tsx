import { createClient } from '@/lib/supabase/server';
import ProductCreateForm from './ProductCreateForm';

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('id, name, slug').order('name');

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-2xl font-light text-white">New Product</h1>
      <p className="text-sm text-gray-400">Single image upload for MVP (schema supports images[] array for future gallery). Stock defaults to in_stock.</p>
      <ProductCreateForm categories={categories ?? []} />
    </div>
  );
}
