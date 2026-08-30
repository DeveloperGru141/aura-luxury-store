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
  const imageError = !imageFile ? 'Image is required' : null;
  const productsError = selectedProducts.length === 0 ? 'Tag at least one product' : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-900">Look details</h2>
        <p className="mt-1 text-xs text-gray-500">Image will be rendered with object-fit: cover — use consistent aspect ratio.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Placement *</label>
            <select value={placement} onChange={(e) => setPlacement(e.target.value as any)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value="hero">Hero</option>
              <option value="lookbook">Lookbook</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Display order</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Caption</label>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Masterpiece Calibre" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Image *</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-medium file:text-gray-700 hover:file:bg-gray-200" required />
          {imageError && !imageFile && error && <p className="mt-1.5 text-xs text-red-600">{imageError}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Tag products *</label>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by name or slug..." className="mb-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white">
            {filtered.length === 0 && <div className="p-3 text-xs text-gray-500">No products — create products first.</div>}
            {filtered.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-2 border-b border-gray-100 px-3 py-2 text-sm last:border-0 hover:bg-gray-50">
                <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => toggleProduct(p.id)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="flex-1 truncate text-gray-900">{p.name}</span>
                <span className="font-mono text-xs text-gray-500">{p.slug}</span>
              </label>
            ))}
          </div>
          {productsError && selectedProducts.length === 0 && error && <p className="mt-1.5 text-xs text-red-600">{productsError}</p>}
          <p className="mt-1 text-xs text-gray-500">{selectedProducts.length} selected</p>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
            {loading ? 'Creating…' : 'Create look'}
          </button>
        </div>
      </form>
    </div>
  );
}
