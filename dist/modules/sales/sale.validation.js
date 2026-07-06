"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSalesQuerySchema = exports.createSaleSchema = void 0;
const zod_1 = require("zod");
exports.createSaleSchema = zod_1.z.object({
    items: zod_1.z
        .array(zod_1.z.object({
        product: zod_1.z.string().min(1, 'Product is required'),
        quantity: zod_1.z.coerce.number().int().min(1, 'Quantity must be at least 1'),
    }))
        .min(1, 'At least one product is required'),
});
exports.listSalesQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().optional(),
    limit: zod_1.z.coerce.number().optional(),
    sort: zod_1.z.string().optional(),
});
//# sourceMappingURL=sale.validation.js.map