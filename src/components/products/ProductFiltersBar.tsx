import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFlatCategories } from '../../hooks/useCategories';
import { useProductStore } from '../../store/productStore';
import type { ProductStatus } from '../../types';
import { ProductStatusLabel } from '../../types';

export default function ProductFiltersBar() {
  const { filters, setFilters, resetFilters } = useProductStore();
  const { data: allCategories } = useFlatCategories();
  const parentIds = new Set(allCategories?.map((c) => c.parentId).filter(Boolean));
  const categories = allCategories?.filter((c) => !parentIds.has(c.id));
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput || undefined });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const hasActiveFilters = filters.search || filters.categoryId || filters.status !== undefined || filters.brand;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <select
          className="input w-44"
          value={filters.categoryId || ''}
          onChange={(e) => setFilters({ categoryId: e.target.value || undefined })}
        >
          <option value="">All Categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          className="input w-36"
          value={filters.status ?? ''}
          onChange={(e) => setFilters({ status: e.target.value !== '' ? Number(e.target.value) as ProductStatus : undefined })}
        >
          <option value="">All Status</option>
          {([0, 1, 2, 3] as ProductStatus[]).map((s) => (
            <option key={s} value={s}>{ProductStatusLabel[s]}</option>
          ))}
        </select>

        <select
          className="input w-40"
          value={`${filters.sortBy || 'createdAt'}:${filters.sortDesc ? 'desc' : 'asc'}`}
          onChange={(e) => {
            const [sortBy, dir] = e.target.value.split(':');
            setFilters({ sortBy, sortDesc: dir === 'desc' });
          }}
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="name:asc">Name A–Z</option>
          <option value="name:desc">Name Z–A</option>
          <option value="price:asc">Price ↑</option>
          <option value="price:desc">Price ↓</option>
        </select>

        {hasActiveFilters && (
          <button className="btn-secondary text-xs" onClick={resetFilters}>
            <X size={14} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
