'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errs: Record<string, string> = {};
    const usernameTrim = username.trim();
    let email = '';
    if (!usernameTrim) {
      errs.username = 'Username is required';
    } else if (usernameTrim.toLowerCase() === 'admin') {
      email = 'admin@yourdomain.com';
    } else if (usernameTrim.includes('@')) {
      email = usernameTrim;
    } else {
      errs.username = 'Enter a valid username';
    }
    if (!password) errs.password = 'Password is required';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Hard navigation ensures the Supabase auth cookie is sent to the server
    // before middleware checks `getUser()`. router.push + router.refresh alone
    // can leave the session invisible until a manual refresh.
    window.location.assign('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Sign in</h1>
        <p className="mt-1 text-sm text-gray-500">Admin access — OMO ESHO SIGNATURES</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-invalid={!!fieldErrors.username}
            />
            {fieldErrors.username && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.username}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-invalid={!!fieldErrors.password}
            />
            {fieldErrors.password && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password}</p>}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
