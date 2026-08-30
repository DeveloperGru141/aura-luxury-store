'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ProductRowActions({
  id,
  stock_status,
  variant = 'toggle',
}: {
  id: string;
  stock_status: 'in_stock' | 'out_of_stock';
  variant?: 'toggle' | 'delete';
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const supabase = createClient();
    const newStatus = stock_status === 'in_stock' ? 'out_of_stock' : 'in_stock';
    const { error } = await supabase.from('products').update({ stock_status: newStatus }).eq('id', id);
    if (error) alert(error.message);
    else router.refresh();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product? This is a hard delete with no undo.')) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    else router.refresh();
    setLoading(false);
  };

  if (variant === 'delete') {
    return (
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs hover:bg-rose-900/40 disabled:opacity-50"
      >
        Delete
      </button>
    );
  }

  const isInStock = stock_status === 'in_stock';
  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors disabled:opacity-50 ${
        isInStock ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300' : 'bg-amber-950/40 border-amber-500/20 text-amber-300'
      }`}
      title="Click to toggle stock status"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-emerald-400' : 'bg-amber-400'} `} />
      {isInStock ? 'In Stock' : 'Out of Stock'}
    </button>
  );
}
