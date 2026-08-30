import { createClient } from '@/lib/supabase/server';
import LookCreateForm from './LookCreateForm';

export default async function NewLookPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from('products').select('id, name, slug').order('name').limit(100);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-2xl font-light text-white">New Look</h1>
      <p className="text-sm text-gray-400">One styled image routed to hero or lookbook, tagging multiple products. Delete-and-recreate to change tags/image per spec.</p>
      <LookCreateForm products={products ?? []} />
    </div>
  );
}
