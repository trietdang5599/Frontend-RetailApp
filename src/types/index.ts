export type ProductStatus = 0 | 1 | 2 | 3;
export const ProductStatusLabel: Record<ProductStatus, string> = {
  0: 'Draft',
  1: 'Active',
  2: 'Inactive',
  3: 'Out of Stock',
};
export const ProductStatusColor: Record<ProductStatus, string> = {
  0: 'bg-gray-100 text-gray-700',
  1: 'bg-green-100 text-green-700',
  2: 'bg-yellow-100 text-yellow-700',
  3: 'bg-red-100 text-red-700',
};

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  sku?: string;
  priceAdjustment?: number;
  stockQuantity: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number;
  sku?: string;
  brand?: string;
  categoryId: string;
  categoryName?: string;
  status: ProductStatus;
  statusLabel: string;
  totalStock: number;
  primaryImageUrl?: string;
  variants: ProductVariant[];
  images: ProductImage[];
  attributes?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  brand?: string;
  categoryName?: string;
  status: ProductStatus;
  totalStock: number;
  primaryImageUrl?: string;
  variantCount: number;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  productCount: number;
  children: Category[];
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  basePrice: number;
  categoryId: string;
  description?: string;
  shortDescription?: string;
  salePrice?: number;
  sku?: string;
  brand?: string;
  variants?: CreateVariantInput[];
  attributes?: Record<string, string>;
}

export interface CreateVariantInput {
  size?: string;
  color?: string;
  colorHex?: string;
  sku?: string;
  priceAdjustment?: number;
  stockQuantity: number;
}

export interface ProductFilters {
  page: number;
  pageSize: number;
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface ApiError {
  error?: string;
  errors?: string[];
}
