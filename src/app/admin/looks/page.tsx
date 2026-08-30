import { createClient } from '@/lib/supabase/server';
import LooksTable from './LooksTable';

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
        <h1 className="font-serif text-2xl font-light text-white">Looks</h1>
        <a href="/admin/looks/new" className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110">
          + New Look
        </a>
      </div>

      <div className="flex gap-2">
        <a href="/admin/looks?placement=hero" className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${placement === 'hero' ? 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-white' : 'border-white/10 text-gray-400 hover:text-white'}`}>Hero ({placement === 'hero' ? looks?.length ?? 0 : '—'})</a>
        <a href="/admin/looks?placement=lookbook" className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${placement === 'lookbook' ? 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-white' : 'border-white/10 text-gray-400 hover:text-white'}`}>Lookbook ({placement === 'lookbook' ? looks?.length ?? 0 : '—'})</a>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs">
          Error: {error.message}
          {error.message.includes('does not exist') && <span className="block mt-1 text-amber-300">Run migration SQL first</span>}
        </div>
      )}

      <LooksTable looks={looks ?? []} placement={placement} />

      <p className="text-[11px] text-gray-500">Per spec: no edit beyond display_order. To change tagged products or image, delete and recreate. Tagged products render as list/strip near image — no hotspot tagging.</p>
    </div>
  );
}
