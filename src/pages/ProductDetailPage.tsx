import { ChevronLeft, Edit, Package, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDeleteProduct, useProduct } from '../hooks/useProducts';
import { formatDate, formatPrice } from '../utils/format';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const deleteMutation = useDeleteProduct();
  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) return <div className="p-8 text-center text-gray-400 animate-pulse">Loading product...</div>;
  if (!product) return <div className="p-8 text-center text-gray-500">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/products" className="text-gray-400 hover:text-gray-600"><ChevronLeft size={20} /></Link>
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <StatusBadge status={product.status} />
        </div>
        <div className="flex gap-2">
          <Link to={`/products/${id}/edit`} className="btn-secondary"><Edit size={15} /> Edit</Link>
          <button className="btn-danger" onClick={() => setShowDelete(true)}><Trash2 size={15} /> Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Product Details</h3>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div><dt className="text-gray-500">Brand</dt><dd className="font-medium">{product.brand || '–'}</dd></div>
              <div><dt className="text-gray-500">SKU</dt><dd className="font-medium font-mono">{product.sku || '–'}</dd></div>
              <div><dt className="text-gray-500">Category</dt><dd className="font-medium">{product.categoryName}</dd></div>
              <div><dt className="text-gray-500">Total Stock</dt><dd className={`font-medium ${product.totalStock === 0 ? 'text-red-500' : ''}`}>{product.totalStock}</dd></div>
              <div><dt className="text-gray-500">Base Price</dt><dd className="font-medium">{formatPrice(product.basePrice)}</dd></div>
              {product.salePrice && <div><dt className="text-gray-500">Sale Price</dt><dd className="font-medium text-sky-600">{formatPrice(product.salePrice)}</dd></div>}
              <div><dt className="text-gray-500">Created</dt><dd>{formatDate(product.createdAt)}</dd></div>
              <div><dt className="text-gray-500">Updated</dt><dd>{formatDate(product.updatedAt)}</dd></div>
            </dl>
            {product.shortDescription && <p className="text-sm text-gray-600 border-t border-gray-100 pt-3">{product.shortDescription}</p>}
            {product.description && <p className="text-sm text-gray-600">{product.description}</p>}
          </div>

          {product.variants.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Variants ({product.variants.length})</h3>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 text-xs border-b border-gray-200">
                  <tr>
                    <th className="pb-2">Size</th>
                    <th className="pb-2">Color</th>
                    <th className="pb-2">SKU</th>
                    <th className="pb-2 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {product.variants.map((v) => (
                    <tr key={v.id}>
                      <td className="py-2">{v.size || '–'}</td>
                      <td className="py-2 flex items-center gap-2">
                        {v.colorHex && <span className="w-3 h-3 rounded-full border border-gray-200" style={{ background: v.colorHex }} />}
                        {v.color || '–'}
                      </td>
                      <td className="py-2 font-mono text-xs text-gray-400">{v.sku || '–'}</td>
                      <td className={`py-2 text-right font-medium ${v.isOutOfStock ? 'text-red-500' : v.isLowStock ? 'text-amber-500' : 'text-gray-700'}`}>
                        {v.stockQuantity} {v.isLowStock && !v.isOutOfStock && '⚠️'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {product.images.length > 0 ? (
            <div className="card overflow-hidden">
              <img
                src={product.primaryImageUrl || product.images[0].url}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              {product.images.length > 1 && (
                <div className="flex gap-1 p-2">
                  {product.images.slice(0, 4).map((img) => (
                    <img key={img.id} src={img.url} className="w-12 h-12 rounded object-cover" />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card p-8 flex flex-col items-center text-gray-300">
              <Package size={48} />
              <p className="text-sm mt-2">No images</p>
            </div>
          )}

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="card p-4">
              <h4 className="font-semibold text-sm text-gray-900 mb-3">Attributes</h4>
              <dl className="space-y-2 text-sm">
                {Object.entries(product.attributes).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-gray-500 capitalize">{k}</dt>
                    <dd className="font-medium text-right">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {showDelete && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${product.name}"?`}
          onConfirm={() => deleteMutation.mutate(id!, { onSuccess: () => navigate('/products') })}
          onCancel={() => setShowDelete(false)}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
