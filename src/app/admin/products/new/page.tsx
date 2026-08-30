import { createClient } from '@/lib/supabase/server';
import ProductCreateForm from './ProductCreateForm';

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('id, name, slug').order('name');

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">New product</h1>
        <p className="mt-1 text-sm text-gray-500">Single image for MVP — schema supports images array for future gallery.</p>
      </div>
      <ProductCreateForm categories={categories ?? []} />
    </div>
  );
}
