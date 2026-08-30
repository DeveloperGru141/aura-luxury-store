'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminConfirmDialog } from '../components/ui';

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
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    else router.refresh();
    setLoading(false);
    setConfirmOpen(false);
  };

  if (variant === 'delete') {
    return (
      <>
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={loading}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
        <AdminConfirmDialog
          open={confirmOpen}
          title="Delete product?"
          description="This is a hard delete with no undo. The product will be removed from all listings and looks."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
          loading={loading}
        />
      </>
    );
  }

  const isInStock = stock_status === 'in_stock';
  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
        isInStock ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-300 bg-gray-100 text-gray-600'
      }`}
      title="Toggle stock status"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isInStock ? 'bg-green-500' : 'bg-gray-400'}`} />
      {isInStock ? 'In stock' : 'Out of stock'}
    </button>
  );
}
