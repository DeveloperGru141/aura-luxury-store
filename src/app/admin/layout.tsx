import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/admin" className="text-sm font-semibold tracking-tight text-gray-900">
            Admin<span className="font-normal text-gray-500"> — OMO ESHO SIGNATURES</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin/categories" className="rounded-lg px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              Categories
            </Link>
            <Link href="/admin/products" className="rounded-lg px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              Products
            </Link>
            {user && (
              <form action="/admin/logout" method="post" className="ml-1">
                <button type="submit" className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  Logout
                </button>
              </form>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
