import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  purchasePrice: z.coerce
    .number()
    .gt(0, 'Purchase price must be greater than 0'),
  sellingPrice: z.coerce.number().gt(0, 'Selling price must be greater than 0'),
  stockQuantity: z.coerce.number().min(0).default(0),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  sort: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
