import Link from 'next/link';

export default function AdminIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage categories and products.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/admin/categories" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300 hover:shadow">
          <h2 className="text-sm font-semibold text-gray-900">Categories</h2>
          <p className="mt-1 text-sm text-gray-500">Create and list</p>
        </Link>
        <Link href="/admin/products" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300 hover:shadow">
          <h2 className="text-sm font-semibold text-gray-900">Products</h2>
          <p className="mt-1 text-sm text-gray-500">Create, delete, toggle stock</p>
        </Link>
      </div>
    </div>
  );
}
