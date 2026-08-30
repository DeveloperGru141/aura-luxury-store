'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LooksTable({ looks, placement }: { looks: any[]; placement: string }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orderVal, setOrderVal] = useState<number>(0);

  const handleOrderSave = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('looks').update({ display_order: orderVal }).eq('id', id);
    if (error) alert(error.message);
    else {
      setEditingId(null);
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this look? This will also remove tagged products.')) return;
    const supabase = createClient();
    const { error } = await supabase.from('looks').delete().eq('id', id);
    if (error) alert(error.message);
    else router.refresh();
  };

  if (!looks || looks.length === 0) {
    return <div className="p-8 text-center text-gray-500 text-sm rounded-2xl bg-[#13161D] border border-white/10">No {placement} looks yet — create via “New Look”.</div>;
  }

  return (
    <div className="rounded-2xl bg-[#13161D] border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Caption</th>
              <th className="text-left px-4 py-3">Products</th>
              <th className="text-left px-4 py-3">Order</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {looks.map((look) => (
              <tr key={look.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <img src={look.image_url} alt={look.caption ?? 'look'} className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                </td>
                <td className="px-4 py-3 text-gray-300 text-xs max-w-[200px] truncate">{look.caption ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-[#F3E5AB]">
                  {look.look_products?.length ? look.look_products.map((lp: any) => lp.products?.name).join(', ') : '—'}
                </td>
                <td className="px-4 py-3">
                  {editingId === look.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={orderVal}
                        onChange={(e) => setOrderVal(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 rounded-lg bg-[#0A0C0F] border border-white/10 text-white text-xs"
                      />
                      <button onClick={() => handleOrderSave(look.id)} className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-2 py-1 rounded-lg bg-white/10 text-gray-300 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(look.id);
                        setOrderVal(look.display_order);
                      }}
                      className="text-[#F3E5AB] hover:underline text-xs"
                    >
                      {look.display_order} ✎
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(look.id)} className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs hover:bg-rose-900/40">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
