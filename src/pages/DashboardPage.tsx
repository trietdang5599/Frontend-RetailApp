import { Package, Tag, TrendingUp, AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { formatPrice } from '../utils/format';
import { clearCache } from '../api/admin';

export default function DashboardPage() {
  const { data: products } = useProducts({ page: 1, pageSize: 5, sortBy: 'createdAt', sortDesc: true });
  const { data: categories } = useCategories(false);
  const [clearing, setClearing] = useState(false);

  const handleClearCache = async () => {
    setClearing(true);
    try {
      await clearCache();
      toast.success('Cache cleared successfully');
    } catch {
      // error toast already handled by apiClient interceptor
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={handleClearCache}
          disabled={clearing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 size={15} />
          {clearing ? 'Clearing…' : 'Clear Cache'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products?.totalCount ?? '–', icon: Package, color: 'text-sky-500 bg-sky-50' },
          { label: 'Categories', value: categories?.length ?? '–', icon: Tag, color: 'text-purple-500 bg-purple-50' },
          { label: 'Active Products', value: '–', icon: TrendingUp, color: 'text-green-500 bg-green-50' },
          { label: 'Low Stock', value: '–', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}><Icon size={22} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Products</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {products?.items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">📦</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-400">{p.categoryName} · {p.brand}</p>
              </div>
              <p className="text-sm font-medium text-sky-600">{formatPrice(p.salePrice ?? p.basePrice)}</p>
              <span className="text-xs text-gray-400">Stock: {p.totalStock}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
