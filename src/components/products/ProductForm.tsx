import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFlatCategories } from '../../hooks/useCategories';
import type { Product } from '../../types';

const variantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  colorHex: z.string().optional(),
  sku: z.string().optional(),
  stockQuantity: z.number().int().min(0, 'Stock cannot be negative'),
  priceAdjustment: z.number().optional(),
});

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().optional(),
  basePrice: z.number().min(0, 'Price must be non-negative'),
  salePrice: z.number().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  shortDescription: z.string().max(300).optional(),
  sku: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  status: z.number().optional(),
  variants: z.array(variantSchema).optional(),
}).refine(
  (d) => !d.salePrice || d.salePrice <= d.basePrice,
  { message: 'Sale price cannot exceed base price', path: ['salePrice'] }
);

type FormValues = z.infer<typeof schema>;

interface Props {
  product?: Product;
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
}

export default function ProductForm({ product, onSubmit, isSubmitting }: Props) {
  const { data: categories } = useFlatCategories();

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: product ? {
      name: product.name,
      slug: product.slug ?? undefined,
      basePrice: product.basePrice,
      salePrice: product.salePrice ?? undefined,
      categoryId: product.categoryId,
      description: product.description ?? undefined,
      shortDescription: product.shortDescription ?? undefined,
      sku: product.sku ?? undefined,
      brand: product.brand ?? undefined,
      status: product.status,
      variants: product.variants?.map((v) => ({
        size: v.size ?? undefined,
        color: v.color ?? undefined,
        colorHex: v.colorHex ?? undefined,
        sku: v.sku ?? undefined,
        stockQuantity: v.stockQuantity,
        priceAdjustment: v.priceAdjustment ?? undefined,
      })),
    } : {
      variants: [],
      status: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Basic Information</h3>

        <div>
          <label className="label">Product Name *</label>
          <input className={`input ${errors.name ? 'input-error' : ''}`} {...register('name')} placeholder="e.g. Classic Cotton T-Shirt" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Brand</label>
            <input className="input" {...register('brand')} placeholder="e.g. Nike" />
          </div>
          <div>
            <label className="label">SKU</label>
            <input className="input" {...register('sku')} placeholder="e.g. SHIRT-001" />
          </div>
        </div>

        <div>
          <label className="label">Category *</label>
          <select className={`input ${errors.categoryId ? 'input-error' : ''}`} {...register('categoryId')}>
            <option value="">Select category...</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="label">Short Description</label>
          <input className="input" {...register('shortDescription')} placeholder="Brief product summary" />
          {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input h-32 resize-none" {...register('description')} placeholder="Full product description..." />
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Base Price (VND) *</label>
            <input
              type="number" step="any" className={`input ${errors.basePrice ? 'input-error' : ''}`}
              {...register('basePrice', { valueAsNumber: true })} placeholder="0"
            />
            {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
          </div>
          <div>
            <label className="label">Sale Price (VND)</label>
            <input
              type="number" step="any" className={`input ${errors.salePrice ? 'input-error' : ''}`}
              {...register('salePrice', { setValueAs: (v) => (v === '' || v == null || (typeof v === 'number' && isNaN(v))) ? undefined : Number(v) })} placeholder="Optional"
            />
            {errors.salePrice && <p className="text-red-500 text-xs mt-1">{errors.salePrice.message}</p>}
          </div>
        </div>
      </div>

      {product && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
          <select className="input w-48" {...register('status', { valueAsNumber: true })}>
            <option value={0}>Draft</option>
            <option value={1}>Active</option>
            <option value={2}>Inactive</option>
          </select>
        </div>
      )}

      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Variants (Sizes / Colors)</h3>
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => append({ size: '', color: '', stockQuantity: 0 })}
          >
            <Plus size={14} /> Add Variant
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No variants yet. Add size/color combinations.</p>
        )}

        {fields.map((field, idx) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Variant #{idx + 1}</span>
              <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label text-xs">Size</label>
                <input className="input text-sm" {...register(`variants.${idx}.size`)} placeholder="S, M, L, XL..." />
              </div>
              <div>
                <label className="label text-xs">Color</label>
                <input className="input text-sm" {...register(`variants.${idx}.color`)} placeholder="Red, Blue..." />
              </div>
              <div>
                <label className="label text-xs">Stock *</label>
                <input
                  type="number" className={`input text-sm ${errors.variants?.[idx]?.stockQuantity ? 'input-error' : ''}`}
                  {...register(`variants.${idx}.stockQuantity`, { valueAsNumber: true })} placeholder="0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
