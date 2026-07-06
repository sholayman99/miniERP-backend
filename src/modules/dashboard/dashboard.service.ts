import { Product } from '../products/product.model'
import { Sale } from '../sales/sale.model'
import { LOW_STOCK_THRESHOLD } from '../inventory/low-stock.service'

export async function getDashboardStats() {
  const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Sale.countDocuments(),
    Product.find({ stockQuantity: { $lt: LOW_STOCK_THRESHOLD } })
      .select('name sku stockQuantity')
      .sort('stockQuantity'),
  ])

  return { totalProducts, totalSales, lowStockProducts }
}
