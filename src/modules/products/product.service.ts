import { Product } from './product.model';
import { NotFoundError, ConflictError } from '../../lib/errors';
import {
  parseListQuery,
  buildSearchFilter,
  buildFieldFilters,
  buildMeta,
} from '../../lib/query-builder';
import type {
  CreateProductInput,
  UpdateProductInput,
} from './product.validation';

const SEARCHABLE_FIELDS = ['name', 'sku', 'category'];
const FILTERABLE_FIELDS = ['category'];

export async function createProduct(
  input: CreateProductInput,
  imageUrls: string[]
) {
  const existing = await Product.findOne({ sku: input.sku.toUpperCase() });
  if (existing)
    throw new ConflictError('A product with this SKU already exists');
  return Product.create({ ...input, imageUrls });
}

export async function listProducts(query: Record<string, unknown>) {
  const parsed = parseListQuery(query, {
    maxLimit: 100,
    defaultSort: '-createdAt',
  });
  const filter = {
    ...buildSearchFilter(parsed.search, SEARCHABLE_FIELDS),
    ...buildFieldFilters(query, FILTERABLE_FIELDS),
  };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(parsed.sort)
      .skip(parsed.skip)
      .limit(parsed.limit),
    Product.countDocuments(filter),
  ]);

  return { items, meta: buildMeta(parsed, total) };
}

export async function getProductById(id: string) {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError('Product not found');
  return product;
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
  imageUrls?: string[]
) {
  const product = await getProductById(id);
  Object.assign(product, input);
  if (imageUrls && imageUrls.length > 0) {
    product.imageUrls = imageUrls;
  }
  await product.save();
  return product;
}

export async function deleteProduct(id: string) {
  const product = await getProductById(id);
  await product.deleteOne();
  return product;
}
