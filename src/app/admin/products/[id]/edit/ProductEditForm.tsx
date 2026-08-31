'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type EditProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  category_id: string;
  images: string[] | null;
};

export default function ProductEditForm({
  product,
  categories,
}: {
  product: EditProduct;
  categories: { id: string; name: string; slug: string }[];
}) {
  const router = useRouter();
  const [name, setName] = useState(product.name ?? '');
  const [description, setDescription] = useState(product.description ?? '');
  const [price, setPrice] = useState(String(product.price ?? ''));
  const [categoryId, setCategoryId] = useState(product.category_id ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) errs.price = 'Enter a valid price greater than 0';
    if (!categoryId) errs.categoryId = 'Select a category';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    const supabase = createClient();

    let images: string[] | undefined;
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `products/${product.slug}-${Date.now()}.${ext}`;
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

    const updatePayload: Record<string, any> = {
      name: name.trim(),
      description: description.trim() || null,
      price: numericPrice,
      category_id: categoryId,
    };
    if (images) updatePayload.images = images;

    const { error: updateError } = await supabase.from('products').update(updatePayload).eq('id', product.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push('/admin/products');
    router.refresh();
  };

  const existingImage = product.images?.[0] ?? null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-900">Product details</h2>
        <p className="mt-1 text-xs text-gray-500">Slug <span className="font-mono">{product.slug}</span> is fixed and not editable. Stock status is managed from the product list.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Monceau Satchel" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          {fieldErrors.name && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Hand-burnished calfskin..." rows={3} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Price (NGN) *</label>
            <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="420000.00" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            {fieldErrors.price && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.price}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </select>
            {fieldErrors.categoryId && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.categoryId}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Image</label>
          {existingImage && !imageFile && (
            <div className="mb-2 flex items-center gap-3">
              <img src={existingImage} alt="Current" className="h-16 w-16 rounded-lg border border-gray-200 object-cover" />
              <span className="text-xs text-gray-500">Current image — choose a file below to replace.</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-medium file:text-gray-700 hover:file:bg-gray-200" />
          <p className="mt-1 text-xs text-gray-500">Replacing uploads to product-images bucket. Keep aspect ratio consistent — rendered with object-fit: cover. Leave empty to keep existing.</p>
          {imageFile && <p className="mt-1 text-xs text-gray-600">New file selected: {imageFile.name}</p>}
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.push('/admin/products')} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
