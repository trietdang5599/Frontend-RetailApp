import { ChevronLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ProductForm from '../components/products/ProductForm';
import { useCreateProduct } from '../hooks/useProducts';

export default function CreateProductPage() {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/products" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-xl font-bold text-gray-900">New Product</h2>
      </div>

      <ProductForm
        isSubmitting={createMutation.isPending}
        onSubmit={(data) =>
          createMutation.mutate(
            { ...data, basePrice: Number(data.basePrice) },
            { onSuccess: (product) => navigate(`/products/${product.id}`) }
          )
        }
      />
    </div>
  );
}
