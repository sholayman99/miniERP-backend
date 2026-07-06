import { logger } from '../../lib/logger'

export const LOW_STOCK_THRESHOLD = 5

type StockAware = {
  _id: unknown
  name: string
  sku: string
  stockQuantity: number
}

/**
 * Call this right after a product's stockQuantity changes — e.g. at the end
 * of a sale-creation transaction, and after a manual product-quantity edit.
 */
export function checkLowStock(product: StockAware) {
  if (product.stockQuantity < LOW_STOCK_THRESHOLD) {
    logger.warn(
      { productId: String(product._id), sku: product.sku, stockQuantity: product.stockQuantity },
      'low_stock',
    )
  }
}
