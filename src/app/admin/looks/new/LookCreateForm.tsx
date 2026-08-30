'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LookCreateForm({ products }: { products: { id: string; name: string; slug: string }[] }) {
  const router = useRouter();
  const [placement, setPlacement] = useState<'hero' | 'lookbook'>('hero');
  const [caption, setCaption] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!imageFile) {
      setError('Image is required');
      return;
    }
    if (selectedProducts.length === 0) {
      setError('Tag at least one product');
      return;
    }
    setLoading(true);
    const supabase = createClient();

    const ext = imageFile.name.split('.').pop();
    const path = `looks/${placement}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('product-images').upload(path, imageFile, { cacheControl: '3600', upsert: false });
    if (uploadError) {
      setError(`Image upload failed: ${uploadError.message}`);
      setLoading(false);
      return;
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    const image_url = data.publicUrl;

    const { data: look, error: insertError } = await supabase
      .from('looks')
      .insert({ placement, image_url, caption: caption.trim() || null, display_order: displayOrder })
      .select('id')
      .single();

    if (insertError || !look) {
      setError(insertError?.message ?? 'Failed to create look');
      setLoading(false);
      return;
    }

    const rows = selectedProducts.map((pid) => ({ look_id: look.id, product_id: pid }));
    const { error: lpError } = await supabase.from('look_products').insert(rows);
    if (lpError) {
      setError(`Look created but tagging failed: ${lpError.message} — delete and recreate`);
      setLoading(false);
      return;
    }

    router.push('/admin/looks');
    router.refresh();
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()) || p.slug.includes(filter.toLowerCase()));

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-[#13161D] border border-white/10 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Placement *</label>
          <select value={placement} onChange={(e) => setPlacement(e.target.value as any)} className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm">
            <option value="hero">Hero</option>
            <option value="lookbook">Lookbook</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Display Order</label>
          <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm" />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-300 mb-1 block">Caption (optional)</label>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Masterpiece Calibre" className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm" />
      </div>

      <div>
        <label className="text-xs text-gray-300 mb-1 block">Image *</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#D4AF37]/15 file:text-[#F3E5AB] file:text-xs" required />
        <p className="text-[11px] text-gray-500 mt-1">Hero animation assumes consistent aspect — upload will be rendered with object-fit: cover</p>
      </div>

      <div>
        <label className="text-xs text-gray-300 mb-1 block">Tag Products * (multi-select, searchable)</label>
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by name or slug..." className="w-full mb-2 px-3 py-2 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm" />
        <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[#0A0C0F] divide-y divide-white/5">
          {filtered.length === 0 && <div className="p-3 text-xs text-gray-500">No products — create products first (FK requirement)</div>}
          {filtered.map((p) => (
            <label key={p.id} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 cursor-pointer text-sm">
              <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => toggleProduct(p.id)} className="rounded border-white/20 bg-transparent text-[#D4AF37] focus:ring-[#D4AF37]/30" />
              <span className="text-white flex-1 truncate">{p.name}</span>
              <span className="text-gray-500 text-xs font-mono">{p.slug}</span>
            </label>
          ))}
        </div>
        <p className="text-[11px] text-gray-500 mt-1">{selectedProducts.length} selected</p>
      </div>

      {error && <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs">{error}</div>}

      <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Look'}
      </button>
    </form>
  );
}
