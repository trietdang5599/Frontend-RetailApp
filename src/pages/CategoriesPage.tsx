import { Plus, Tag } from 'lucide-react';
import { useState } from 'react';
import { useCategories, useCreateCategory } from '../hooks/useCategories';
import type { Category } from '../types';

function CategoryRow({ category, depth = 0 }: { category: Category; depth?: number }) {
  return (
    <>
      <tr className="hover:bg-gray-50 border-b border-gray-100">
        <td className="px-6 py-3 text-sm" style={{ paddingLeft: `${24 + depth * 20}px` }}>
          <div className="flex items-center gap-2">
            {depth > 0 && <span className="text-gray-300">└</span>}
            <Tag size={14} className="text-gray-400" />
            <span className="font-medium text-gray-800">{category.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-400 font-mono">{category.slug}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{category.description || '–'}</td>
        <td className="px-4 py-3 text-sm text-center font-medium">{category.productCount}</td>
      </tr>
      {category.children.map((c) => (
        <CategoryRow key={c.id} category={c} depth={depth + 1} />
      ))}
    </>
  );
}

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories(true);
  const createMutation = useCreateCategory();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', parentId: '' });

  const handleCreate = () => {
    if (!form.name.trim() || !form.parentId) return;
    createMutation.mutate(
      { name: form.name, description: form.description || undefined, parentId: form.parentId },
      { onSuccess: () => { setShowForm(false); setForm({ name: '', description: '', parentId: '' }); } }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-900">Categories</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="mx-6 mt-4 card p-4 space-y-3 max-w-md">
          <h3 className="font-semibold text-sm">New Sub-Category</h3>
          <div>
            <label className="label">Parent Category *</label>
            <select
              className="input"
              value={form.parentId}
              onChange={(e) => setForm(f => ({ ...f, parentId: e.target.value }))}
            >
              <option value="">Select parent...</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <input
            className="input" placeholder="Category name *" value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <input
            className="input" placeholder="Description (optional)" value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <div className="flex gap-2">
            <button className="btn-primary text-sm" onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Create'}
            </button>
            <button className="btn-secondary text-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-4 mx-6 card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Slug</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Products</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-6 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : categories?.map((c) => (
              <CategoryRow key={c.id} category={c} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
