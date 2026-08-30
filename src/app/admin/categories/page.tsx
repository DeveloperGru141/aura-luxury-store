import { createClient } from '@/lib/supabase/server';
import CategoryCreateForm from './CategoryCreateForm';

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, image_url, created_at')
    .order('created_at', { ascending: true });

  // Fetch product counts per category
  let counts: Record<string, number> = {};
  if (categories) {
    const { data: products } = await supabase.from('products').select('category_id');
    if (products) {
      for (const p of products) {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-light text-white">Categories</h1>
        <span className="text-xs text-gray-400">{categories?.length ?? 0} total</span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs">
          Error loading categories: {error.message}
          {error.message.includes('does not exist') && (
            <span className="block mt-1 text-amber-300">Run supabase/migrations/20250830000001_initial_schema.sql in Supabase SQL Editor</span>
          )}
        </div>
      )}

      <CategoryCreateForm />

      <div className="rounded-2xl bg-[#13161D] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-left px-4 py-3">Products</th>
                <th className="text-left px-4 py-3">Image</th>
                <th className="text-left px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories?.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-[#F3E5AB]">{counts[cat.id] ?? 0}</td>
                  <td className="px-4 py-3">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(cat.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!categories || categories.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No categories yet — 5 defaults will appear after migration is applied.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-gray-500">Categories: create + list only. No update/delete UI per spec — DB has ON DELETE RESTRICT safety.</p>
    </div>
  );
}
