import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProductRowActions from './ProductRowActions';
import { AdminCard, AdminTable, AdminTableHeader, AdminTableHead, AdminTableRow, AdminTableCell, AdminErrorState, AdminEmptyState } from '../components/ui';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, price, stock_status, images, created_at, categories(name, slug)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">{products?.length ?? 0} total</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
          New product
        </Link>
      </div>

      {error && <AdminErrorState message={error.message + (error.message.includes('does not exist') ? ' — Run migration in Supabase SQL Editor' : '')} />}

      <AdminCard>
        <AdminTable>
          <AdminTableHeader>
            <tr>
              <AdminTableHead>Product</AdminTableHead>
              <AdminTableHead>Category</AdminTableHead>
              <AdminTableHead>Price</AdminTableHead>
              <AdminTableHead>Stock</AdminTableHead>
              <AdminTableHead className="w-24">Actions</AdminTableHead>
            </tr>
          </AdminTableHeader>
          <tbody>
            {products?.map((p: any) => (
              <AdminTableRow key={p.id}>
                <AdminTableCell>
                  <div className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg border border-gray-200 object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-50" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900 line-clamp-1">{p.name}</div>
                      <div className="font-mono text-xs text-gray-500">{p.slug}</div>
                    </div>
                  </div>
                </AdminTableCell>
                <AdminTableCell className="text-sm text-gray-600">{p.categories?.name ?? '—'}</AdminTableCell>
                <AdminTableCell className="font-medium text-gray-900">₦{Number(p.price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</AdminTableCell>
                <AdminTableCell>
                  <ProductRowActions id={p.id} stock_status={p.stock_status} />
                </AdminTableCell>
                <AdminTableCell>
                  <ProductRowActions id={p.id} stock_status={p.stock_status} variant="delete" />
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {(!products || products.length === 0) && !error && (
              <tr>
                <td colSpan={5} className="p-0">
                  <AdminEmptyState title="No products yet" description="Add your first product to get started." action={<Link href="/admin/products/new" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">New product</Link>} />
                </td>
              </tr>
            )}
          </tbody>
        </AdminTable>
      </AdminCard>
    </div>
  );
}
