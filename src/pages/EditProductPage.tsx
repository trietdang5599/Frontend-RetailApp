import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/products/ProductForm';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const updateMutation = useUpdateProduct(id!);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-6 animate-pulse space-y-3">
            <div className="h-5 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!product) {
    return <div className="p-8 text-center text-gray-500">Product not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/products/${id}`} className="text-gray-400 hover:text-gray-600">
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-xl font-bold text-gray-900">Edit: {product.name}</h2>
      </div>

      <ProductForm
        product={product}
        isSubmitting={updateMutation.isPending}
        onSubmit={(data) =>
          updateMutation.mutate(
            { ...data, status: data.status as any },
            { onSuccess: () => navigate(`/products/${id}`) }
          )
        }
      />
    </div>
  );
}
