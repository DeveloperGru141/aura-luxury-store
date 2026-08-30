'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminTable, AdminTableHeader, AdminTableHead, AdminTableRow, AdminTableCell, AdminEmptyState, AdminConfirmDialog } from '../components/ui';

export default function LooksTable({ looks, placement }: { looks: any[]; placement: string }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orderVal, setOrderVal] = useState<number>(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOrderSave = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('looks').update({ display_order: orderVal }).eq('id', id);
    if (error) alert(error.message);
    else {
      setEditingId(null);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from('looks').delete().eq('id', deleteId);
    if (error) alert(error.message);
    else router.refresh();
    setDeleting(false);
    setDeleteId(null);
  };

  if (!looks || looks.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <AdminEmptyState title={`No ${placement} looks`} description="Create a new look to get started." />
      </div>
    );
  }

  return (
    <>
      <AdminTable>
        <AdminTableHeader>
          <tr>
            <AdminTableHead>Image</AdminTableHead>
            <AdminTableHead>Caption</AdminTableHead>
            <AdminTableHead>Products</AdminTableHead>
            <AdminTableHead>Order</AdminTableHead>
            <AdminTableHead>Actions</AdminTableHead>
          </tr>
        </AdminTableHeader>
        <tbody>
          {looks.map((look) => (
            <AdminTableRow key={look.id}>
              <AdminTableCell>
                <img src={look.image_url} alt={look.caption ?? 'look'} className="h-16 w-16 rounded-lg border border-gray-200 object-cover" />
              </AdminTableCell>
              <AdminTableCell className="max-w-[200px] truncate text-sm text-gray-600">{look.caption ?? '—'}</AdminTableCell>
              <AdminTableCell className="text-sm text-gray-700">
                {look.look_products?.length ? look.look_products.map((lp: any) => lp.products?.name).join(', ') : '—'}
              </AdminTableCell>
              <AdminTableCell>
                {editingId === look.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={orderVal}
                      onChange={(e) => setOrderVal(parseInt(e.target.value) || 0)}
                      className="w-16 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button onClick={() => handleOrderSave(look.id)} className="rounded-lg bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(look.id);
                      setOrderVal(look.display_order);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    {look.display_order} ✎
                  </button>
                )}
              </AdminTableCell>
              <AdminTableCell>
                <button onClick={() => setDeleteId(look.id)} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </tbody>
      </AdminTable>

      <AdminConfirmDialog
        open={!!deleteId}
        title="Delete look?"
        description="This will also remove tagged products. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
