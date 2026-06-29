import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoriesApi } from '../api/categories';
import type { Category } from '../types';

export function useCategories(tree = true) {
  return useQuery({
    queryKey: ['categories', tree],
    queryFn: () => categoriesApi.getAll(tree),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFlatCategories() {
  const { data, ...rest } = useCategories(false);
  return { data: data as Category[] | undefined, ...rest };
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
    },
  });
}
