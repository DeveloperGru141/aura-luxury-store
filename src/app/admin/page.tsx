import Link from 'next/link';

export default function AdminIndexPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-light text-white">Admin Dashboard</h1>
      <p className="text-sm text-gray-400">Manage categories, products, and curated looks.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/categories" className="p-6 rounded-2xl bg-[#13161D] border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
          <h2 className="font-medium text-white mb-1">Categories</h2>
          <p className="text-xs text-gray-400">Create & list (5 seeded: clothes, bags, shoes, wristwatches, jewelry)</p>
        </Link>
        <Link href="/admin/products" className="p-6 rounded-2xl bg-[#13161D] border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
          <h2 className="font-medium text-white mb-1">Products</h2>
          <p className="text-xs text-gray-400">Create, delete, toggle in-stock/out-of-stock</p>
        </Link>
        <Link href="/admin/looks" className="p-6 rounded-2xl bg-[#13161D] border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
          <h2 className="font-medium text-white mb-1">Looks</h2>
          <p className="text-xs text-gray-400">Hero & Lookbook curated multi-product looks</p>
        </Link>
      </div>

      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200 text-xs">
        <strong>Security note:</strong> Default credentials <span className="font-mono">admin / admin</span> (email <span className="font-mono">admin@yourdomain.com</span>) are placeholder. Change before live.
      </div>
    </div>
  );
}
