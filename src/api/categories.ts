import { apiClient } from './client';
import type { Category } from '../types';

export const categoriesApi = {
  getAll: async (tree = true): Promise<Category[]> => {
    const res = await apiClient.get(`/categories?tree=${tree}`);
    return res.data;
  },

  getLeaf: async (): Promise<Category[]> => {
    const res = await apiClient.get(`/categories?tree=false&leafOnly=true`);
    return res.data;
  },

  create: async (data: { name: string; slug?: string; description?: string; parentId?: string }): Promise<Category> => {
    const res = await apiClient.post('/categories', data);
    return res.data;
  },
};
