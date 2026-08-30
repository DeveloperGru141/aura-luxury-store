'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function ProductCreateForm({ categories }: { categories: { id: string; name: string; slug: string }[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'out_of_stock'>('in_stock');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (v: string) => {
    setName(v);
    setSlug(slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    setLoading(true);
    const supabase = createClient();

    let images: string[] = [];
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `products/${slug}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(path, imageFile, { cacheControl: '3600', upsert: false });
      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      images = [data.publicUrl];
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError('Price must be a valid number > 0');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('products').insert({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      price: numericPrice,
      category_id: categoryId,
      images,
      stock_status: stockStatus,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push('/admin/products');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-[#13161D] border border-white/10 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Name *</label>
          <input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Monceau Satchel" className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" required />
        </div>
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Slug (auto)</label>
          <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="monceau-satchel" className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#D4AF37]/50" required />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-300 mb-1 block">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Hand-burnished calfskin..." rows={3} className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Price (NGN) *</label>
          <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="420000.00" className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" required />
        </div>
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Category *</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" required>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Image (single for MVP, public bucket)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#D4AF37]/15 file:text-[#F3E5AB] file:text-xs hover:file:bg-[#D4AF37]/25" />
          <p className="text-[11px] text-gray-500 mt-1">Aspect-ratio: use consistent ratio for hero animation; component uses object-fit: cover</p>
        </div>
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Stock Status</label>
          <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value as any)} className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50">
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock (badge)</option>
          </select>
        </div>
      </div>

      {error && <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs">{error}</div>}

      <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
