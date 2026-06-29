import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import './index.css';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CreateProductPage = lazy(() => import('./pages/CreateProductPage'));
const EditProductPage = lazy(() => import('./pages/EditProductPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-48 text-gray-400">
      <div className="animate-spin rounded-full border-4 border-gray-200 border-t-sky-500 w-8 h-8" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
            <Route path="/products" element={<Suspense fallback={<PageLoader />}><ProductsPage /></Suspense>} />
            <Route path="/products/new" element={<Suspense fallback={<PageLoader />}><CreateProductPage /></Suspense>} />
            <Route path="/products/:id" element={<Suspense fallback={<PageLoader />}><ProductDetailPage /></Suspense>} />
            <Route path="/products/:id/edit" element={<Suspense fallback={<PageLoader />}><EditProductPage /></Suspense>} />
            <Route path="/categories" element={<Suspense fallback={<PageLoader />}><CategoriesPage /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
