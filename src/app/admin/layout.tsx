import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0C0F] text-white">
      <header className="sticky top-0 z-30 bg-[#0D0F14]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link href="/admin" className="font-serif text-lg font-bold tracking-[0.2em] text-white">
            TIMELESS <span className="text-[#D4AF37]">ADMIN</span>
          </Link>
          <nav className="flex items-center gap-4 text-xs">
            <Link href="/admin/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link>
            <Link href="/admin/products" className="text-gray-300 hover:text-white transition-colors">Products</Link>
            <Link href="/admin/looks" className="text-gray-300 hover:text-white transition-colors">Looks</Link>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">← Storefront</Link>
            <form action="/admin/logout" method="post">
              <button type="submit" className="text-rose-300 hover:text-rose-200 transition-colors">Logout</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
    </div>
  );
}
