import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductFiltersBar from '../components/products/ProductFiltersBar';
import ProductTable from '../components/products/ProductTable';
import Pagination from '../components/common/Pagination';
import { useProducts } from '../hooks/useProducts';
import { useProductStore } from '../store/productStore';

export default function ProductsPage() {
  const { filters, setFilters } = useProductStore();
  const { data, isLoading, isError } = useProducts(filters);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          {data && (
            <p className="text-sm text-gray-500 mt-0.5">{data.totalCount} total products</p>
          )}
        </div>
        <Link to="/products/new" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <ProductFiltersBar />

      <div className="flex-1 bg-white">
        {isError ? (
          <div className="flex items-center justify-center py-20 text-red-500">
            Failed to load products. Please try again.
          </div>
        ) : (
          <ProductTable products={data?.items ?? []} isLoading={isLoading} />
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="bg-white border-t border-gray-200">
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onChange={(p) => setFilters({ page: p })}
          />
        </div>
      )}
    </div>
  );
}
