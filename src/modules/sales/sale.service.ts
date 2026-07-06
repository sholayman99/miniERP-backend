import mongoose from 'mongoose'
import { Sale } from './sale.model'
import { Product } from '../products/product.model'
import { BadRequestError, NotFoundError } from '../../lib/errors'
import { checkLowStock } from '../inventory/low-stock.service'
import { parseListQuery, buildMeta } from '../../lib/query-builder'
import type { CreateSaleInput } from './sale.validation'

type StockSnapshot = { _id: unknown; name: string; sku: string; stockQuantity: number }

/**
 * Creates a sale atomically:
 *  - re-checks stock for every line item inside a transaction
 *  - rejects the whole sale if any item is unavailable/insufficient
 *  - decrements stock and computes the grand total
 *  - emits low-stock socket events only after the transaction commits
 *
 * NOTE: mongoose transactions require MongoDB to be running as a replica set
 * (MongoDB Atlas is a replica set by default; a bare local `mongod` is not —
 * run `rs.initiate()` once, or use Atlas, for this to work).
 */
export async function createSale(input: CreateSaleInput, soldBy: string) {
  const session = await mongoose.startSession()
  let sale: Awaited<ReturnType<typeof Sale.create>>[number] | undefined
  let stockSnapshots: StockSnapshot[] = []

  try {
    await session.withTransaction(async () => {
      const items = []
      let grandTotal = 0
      stockSnapshots = []

      for (const line of input.items) {
        const product = await Product.findById(line.product).session(session)
        if (!product) throw new NotFoundError(`Product ${line.product} not found`)

        if (product.stockQuantity < line.quantity) {
          throw new BadRequestError(
            `Insufficient stock for "${product.name}" — available: ${product.stockQuantity}, requested: ${line.quantity}`,
          )
        }

        product.stockQuantity -= line.quantity
        await product.save({ session })

        const subtotal = product.sellingPrice * line.quantity
        grandTotal += subtotal

        items.push({
          product: product._id,
          productName: product.name,
          quantity: line.quantity,
          unitPrice: product.sellingPrice,
          subtotal,
        })

        stockSnapshots.push({
          _id: product._id,
          name: product.name,
          sku: product.sku,
          stockQuantity: product.stockQuantity,
        })
      }

      const createdSales = await Sale.create([{ items, grandTotal, soldBy }], { session })
      sale = createdSales[0]
    })
  } finally {
    await session.endSession()
  }

  // Only broadcast low-stock warnings once the transaction is safely committed.
  for (const snapshot of stockSnapshots) checkLowStock(snapshot)

  return sale
}

export async function listSales(query: Record<string, unknown>) {
  const parsed = parseListQuery(query, { maxLimit: 100, defaultSort: '-createdAt' })

  const [items, total] = await Promise.all([
    Sale.find()
      .populate('soldBy', 'name email')
      .sort(parsed.sort)
      .skip(parsed.skip)
      .limit(parsed.limit),
    Sale.countDocuments(),
  ])

  return { items, meta: buildMeta(parsed, total) }
}

export async function getSaleById(id: string) {
  const sale = await Sale.findById(id).populate('soldBy', 'name email')
  if (!sale) throw new NotFoundError('Sale not found')
  return sale
}
