import { createClient } from '@/lib/supabase/server';
import LooksTable from './LooksTable';
import { AdminErrorState } from '../components/ui';

export default async function AdminLooksPage({ searchParams }: { searchParams: Promise<{ placement?: string }> }) {
  const params = await searchParams;
  const placement = params?.placement === 'lookbook' ? 'lookbook' : 'hero';

  const supabase = await createClient();
  const { data: looks, error } = await supabase
    .from('looks')
    .select('id, placement, image_url, caption, display_order, created_at, look_products(product_id, products(id, name, slug))')
    .eq('placement', placement)
    .order('display_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Looks</h1>
          <p className="mt-1 text-sm text-gray-500">Curated images for hero and lookbook</p>
        </div>
        <a href="/admin/looks/new" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
          New look
        </a>
      </div>

      <div className="flex gap-2">
        <a
          href="/admin/looks?placement=hero"
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${placement === 'hero' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          Hero
        </a>
        <a
          href="/admin/looks?placement=lookbook"
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${placement === 'lookbook' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          Lookbook
        </a>
      </div>

      {error && <AdminErrorState message={error.message + (error.message.includes('does not exist') ? ' — Run migration in Supabase SQL Editor' : '')} />}

      <LooksTable looks={looks ?? []} placement={placement} />
    </div>
  );
}
