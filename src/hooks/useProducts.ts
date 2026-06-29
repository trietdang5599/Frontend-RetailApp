import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productsApi } from '../api/products';
import type { CreateProductInput, ProductFilters, ProductStatus } from '../types';

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  list: (filters: Partial<ProductFilters>) => ['products', 'list', filters] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
};

export function useProducts(filters: Partial<ProductFilters>) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: () => productsApi.getAll(filters),
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductInput) => productsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success('Product created successfully');
    },
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateProductInput> & { status?: ProductStatus }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
      toast.success('Product updated successfully');
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success('Product deleted');
    },
  });
}

export function usePatchProductStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProductStatus }) =>
      productsApi.patchStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}
