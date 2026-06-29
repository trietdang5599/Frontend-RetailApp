import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ProductFilters } from '../types';

interface ProductStore {
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}

const defaultFilters: ProductFilters = {
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortDesc: true,
};

export const useProductStore = create<ProductStore>()(
  devtools(
    (set) => ({
      filters: defaultFilters,
      setFilters: (partial) =>
        set((s) => ({ filters: { ...s.filters, ...partial, page: partial.page ?? 1 } })),
      resetFilters: () => set({ filters: defaultFilters }),
      selectedIds: new Set(),
      toggleSelect: (id) =>
        set((s) => {
          const next = new Set(s.selectedIds);
          next.has(id) ? next.delete(id) : next.add(id);
          return { selectedIds: next };
        }),
      selectAll: (ids) => set({ selectedIds: new Set(ids) }),
      clearSelection: () => set({ selectedIds: new Set() }),
    }),
    { name: 'product-store' }
  )
);
