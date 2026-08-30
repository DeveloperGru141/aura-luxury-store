import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProductRowActions from './ProductRowActions';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, price, stock_status, images, created_at, categories(name, slug)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-light text-white">Products</h1>
        <Link href="/admin/products/new" className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110">
          + New Product
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs">
          Error: {error.message}
          {error.message.includes('does not exist') && <span className="block mt-1 text-amber-300">Run migration SQL first</span>}
        </div>
      )}

      <div className="rounded-2xl bg-[#13161D] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products?.map((p: any) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10" />
                      )}
                      <div>
                        <div className="text-white font-medium line-clamp-1">{p.name}</div>
                        <div className="text-gray-500 text-xs font-mono">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{p.categories?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-[#F3E5AB] font-medium">₦{Number(p.price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3">
                    <ProductRowActions id={p.id} stock_status={p.stock_status} />
                  </td>
                  <td className="px-4 py-3">
                    <ProductRowActions id={p.id} stock_status={p.stock_status} variant="delete" />
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">No products yet — create via “New Product”.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-gray-500">Per spec: create, delete, stock toggle only. No edit screen. Out-of-stock products stay visible with badge on storefront.</p>
    </div>
  );
}
