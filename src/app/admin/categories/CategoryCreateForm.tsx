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

export default function CategoryCreateForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleNameChange = (v: string) => {
    setName(v);
    setSlug(slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const supabase = createClient();

    let image_url: string | null = null;
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `categories/${slug}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(path, imageFile, { cacheControl: '3600', upsert: false });
      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      image_url = data.publicUrl;
    }

    const { error: insertError } = await supabase.from('categories').insert({ name: name.trim(), slug: slug.trim(), image_url });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess(`Category "${name}" created`);
    setName('');
    setSlug('');
    setImageFile(null);
    router.refresh();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-[#13161D] border border-white/10 space-y-4">
      <h2 className="font-medium text-white text-sm">Create Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Name</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Clothes"
            className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Slug (auto)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="clothes"
            className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#D4AF37]/50"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-300 mb-1 block">Image (optional, stored in product-images bucket)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#D4AF37]/15 file:text-[#F3E5AB] file:text-xs hover:file:bg-[#D4AF37]/25"
        />
      </div>

      {error && <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs">{error}</div>}
      {success && <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Category'}
      </button>
    </form>
  );
}
