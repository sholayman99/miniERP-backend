import { z } from 'zod'

export const createSaleSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().min(1, 'Product is required'),
        quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
      }),
    )
    .min(1, 'At least one product is required'),
})

export const listSalesQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
})

export type CreateSaleInput = z.infer<typeof createSaleSchema>
