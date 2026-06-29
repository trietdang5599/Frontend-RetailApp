import { Edit, Eye, Trash2, PackageX } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteProduct } from '../../hooks/useProducts';
import type { ProductSummary } from '../../types';
import { formatPrice, formatDate } from '../../utils/format';
import ConfirmDialog from '../common/ConfirmDialog';
import StatusBadge from '../common/StatusBadge';

interface Props {
  products: ProductSummary[];
  isLoading: boolean;
}

export default function ProductTable({ products, isLoading }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteProduct();

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-6 py-4 animate-pulse flex gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <PackageX size={48} className="mb-4 opacity-40" />
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try adjusting your filters or add a new product</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {p.primaryImageUrl ? (
                        <img src={p.primaryImageUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📦</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.brand || p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600">{p.categoryName || '–'}</td>
                <td className="px-4 py-4">
                  {p.salePrice ? (
                    <div>
                      <p className="font-medium text-sky-600">{formatPrice(p.salePrice)}</p>
                      <p className="text-xs text-gray-400 line-through">{formatPrice(p.basePrice)}</p>
                    </div>
                  ) : (
                    <p className="font-medium">{formatPrice(p.basePrice)}</p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`font-medium ${p.totalStock === 0 ? 'text-red-500' : p.totalStock <= 5 ? 'text-amber-500' : 'text-gray-700'}`}>
                    {p.totalStock}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-4 text-gray-400 text-xs">{formatDate(p.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <Link to={`/products/${p.id}`} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Eye size={15} />
                    </Link>
                    <Link to={`/products/${p.id}/edit`} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-sky-600">
                      <Edit size={15} />
                    </Link>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <ConfirmDialog
          title="Delete Product"
          message="This action cannot be undone. The product will be permanently removed."
          onConfirm={() => deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })}
          onCancel={() => setDeleteId(null)}
          loading={deleteMutation.isPending}
        />
      )}
    </>
  );
}
