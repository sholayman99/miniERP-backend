"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    sku: zod_1.z.string().min(1, 'SKU is required'),
    category: zod_1.z.string().min(1, 'Category is required'),
    purchasePrice: zod_1.z.coerce
        .number()
        .gt(0, 'Purchase price must be greater than 0'),
    sellingPrice: zod_1.z.coerce.number().gt(0, 'Selling price must be greater than 0'),
    stockQuantity: zod_1.z.coerce.number().min(0).default(0),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.listProductsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().optional(),
    limit: zod_1.z.coerce.number().optional(),
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    sort: zod_1.z.string().optional(),
});
//# sourceMappingURL=product.validation.js.map