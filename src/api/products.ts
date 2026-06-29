import { apiClient } from './client';
import type {
  CreateProductInput,
  PagedResult,
  Product,
  ProductFilters,
  ProductSummary,
  ProductStatus,
} from '../types';

export const productsApi = {
  getAll: async (filters: Partial<ProductFilters>): Promise<PagedResult<ProductSummary>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    });
    const res = await apiClient.get(`/products?${params}`);
    return res.data;
  },

  getById: async (id: string): Promise<Product> => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  create: async (data: CreateProductInput): Promise<Product> => {
    const res = await apiClient.post('/products', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateProductInput> & { status?: ProductStatus }): Promise<Product> => {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  patchStatus: async (id: string, status: ProductStatus): Promise<void> => {
    await apiClient.patch(`/products/${id}/status`, { status });
  },
};
