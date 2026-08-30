import { createClient } from '@/lib/supabase/server';
import CategoryCreateForm from './CategoryCreateForm';
import { AdminCard, AdminTable, AdminTableHeader, AdminTableHead, AdminTableRow, AdminTableCell, AdminErrorState, AdminEmptyState } from '../components/ui';

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
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">{categories?.length ?? 0} total</p>
        </div>
      </div>

      {error && (
        <AdminErrorState message={error.message + (error.message.includes('does not exist') ? ' — Run supabase/migrations/20250830000001_initial_schema.sql in Supabase SQL Editor' : '')} />
      )}

      <CategoryCreateForm />

      <AdminCard>
        <AdminTable>
          <AdminTableHeader>
            <tr>
              <AdminTableHead>Name</AdminTableHead>
              <AdminTableHead>Slug</AdminTableHead>
              <AdminTableHead>Products</AdminTableHead>
              <AdminTableHead>Image</AdminTableHead>
              <AdminTableHead>Created</AdminTableHead>
            </tr>
          </AdminTableHeader>
          <tbody>
            {categories?.map((cat) => (
              <AdminTableRow key={cat.id}>
                <AdminTableCell className="font-medium text-gray-900">{cat.name}</AdminTableCell>
                <AdminTableCell className="font-mono text-xs text-gray-500">{cat.slug}</AdminTableCell>
                <AdminTableCell className="text-gray-700">{counts[cat.id] ?? 0}</AdminTableCell>
                <AdminTableCell>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="h-10 w-10 rounded-lg border border-gray-200 object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </AdminTableCell>
                <AdminTableCell className="text-xs text-gray-500">{new Date(cat.created_at).toLocaleDateString()}</AdminTableCell>
              </AdminTableRow>
            ))}
            {(!categories || categories.length === 0) && !error && (
              <tr>
                <td colSpan={5} className="p-0">
                  <AdminEmptyState title="No categories" description="Categories will appear here after the initial migration. Use the form above to add one." />
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminCard>
    </div>
  );
}
