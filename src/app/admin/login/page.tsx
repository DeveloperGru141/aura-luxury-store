'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Support "admin" username shorthand -> admin@yourdomain.com per spec
    let email = emailInput.trim();
    if (email === 'admin') {
      email = 'admin@yourdomain.com';
    } else if (!email.includes('@') && email.length > 0) {
      // If user types non-email username, try to map to allowlist domain
      // For now, require full email - show error
      setError('Please enter a valid email (or "admin" for default account)');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0C0F] px-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#13161D] border border-white/10 shadow-2xl">
        <h1 className="font-serif text-2xl font-light text-white mb-1">TIMELESS Admin</h1>
        <p className="text-sm text-gray-400 mb-6">Sign in with your allowlisted email</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-300 mb-1 block">Email or Username</label>
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder='admin or admin@yourdomain.com'
              className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50 text-sm"
              required
            />
            <p className="text-[11px] text-gray-500 mt-1">Default: <span className="text-[#F3E5AB]">admin / admin</span> maps to admin@yourdomain.com</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-300 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C0F] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50 text-sm"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-sm hover:brightness-110 active:brightness-95 disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-[11px] text-gray-500 mt-6 text-center">
          Protected by RLS allowlist. Only <span className="text-gray-300">admin@yourdomain.com</span> can write.
        </p>
      </div>
    </div>
  );
}
