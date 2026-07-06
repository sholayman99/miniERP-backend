import { Schema, model, InferSchemaType } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: { type: String, required: true, trim: true },
    purchasePrice: { type: Number, required: true, min: 0.01 },
    sellingPrice: { type: Number, required: true, min: 0.01 },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    imageUrls: {
      type: [String],
      required: true,
      validate: {
        validator: (urls: unknown) =>
          Array.isArray(urls) && urls.length > 0 && urls.length <= 3,
        message: 'Products must have between 1 and 3 images',
      },
    },
  },
  { timestamps: true }
);

export type ProductDoc = InferSchemaType<typeof productSchema>;
export const Product = model('Product', productSchema);
