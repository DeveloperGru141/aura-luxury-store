import { createClient } from '@/lib/supabase/server';
import LookCreateForm from './LookCreateForm';

export default async function NewLookPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from('products').select('id, name, slug').order('name').limit(100);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">New look</h1>
        <p className="mt-1 text-sm text-gray-500">One styled image for hero or lookbook, tagging multiple products.</p>
      </div>
      <LookCreateForm products={products ?? []} />
    </div>
  );
}
