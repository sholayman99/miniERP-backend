import { Schema, model, Types, InferSchemaType } from 'mongoose'

const saleItemSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true }, // snapshot, survives later product edits
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }, // snapshot of sellingPrice at sale time
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const saleSchema = new Schema(
  {
    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => Array.isArray(v) && v.length > 0,
        message: 'A sale must contain at least one item',
      },
    },
    grandTotal: { type: Number, required: true, min: 0 },
    soldBy: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

export type SaleDoc = InferSchemaType<typeof saleSchema>
export const Sale = model('Sale', saleSchema)
