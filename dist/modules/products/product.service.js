"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.listProducts = listProducts;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const product_model_1 = require("./product.model");
const errors_1 = require("../../lib/errors");
const query_builder_1 = require("../../lib/query-builder");
const SEARCHABLE_FIELDS = ['name', 'sku', 'category'];
const FILTERABLE_FIELDS = ['category'];
async function createProduct(input, imageUrls) {
    const existing = await product_model_1.Product.findOne({ sku: input.sku.toUpperCase() });
    if (existing)
        throw new errors_1.ConflictError('A product with this SKU already exists');
    return product_model_1.Product.create({ ...input, imageUrls });
}
async function listProducts(query) {
    const parsed = (0, query_builder_1.parseListQuery)(query, {
        maxLimit: 100,
        defaultSort: '-createdAt',
    });
    const filter = {
        ...(0, query_builder_1.buildSearchFilter)(parsed.search, SEARCHABLE_FIELDS),
        ...(0, query_builder_1.buildFieldFilters)(query, FILTERABLE_FIELDS),
    };
    const [items, total] = await Promise.all([
        product_model_1.Product.find(filter)
            .sort(parsed.sort)
            .skip(parsed.skip)
            .limit(parsed.limit),
        product_model_1.Product.countDocuments(filter),
    ]);
    return { items, meta: (0, query_builder_1.buildMeta)(parsed, total) };
}
async function getProductById(id) {
    const product = await product_model_1.Product.findById(id);
    if (!product)
        throw new errors_1.NotFoundError('Product not found');
    return product;
}
async function updateProduct(id, input, imageUrls) {
    const product = await getProductById(id);
    Object.assign(product, input);
    if (imageUrls && imageUrls.length > 0) {
        product.imageUrls = imageUrls;
    }
    await product.save();
    return product;
}
async function deleteProduct(id) {
    const product = await getProductById(id);
    await product.deleteOne();
    return product;
}
//# sourceMappingURL=product.service.js.map