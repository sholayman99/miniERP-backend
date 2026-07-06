"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSale = createSale;
exports.listSales = listSales;
exports.getSaleById = getSaleById;
const mongoose_1 = __importDefault(require("mongoose"));
const sale_model_1 = require("./sale.model");
const product_model_1 = require("../products/product.model");
const errors_1 = require("../../lib/errors");
const low_stock_service_1 = require("../inventory/low-stock.service");
const query_builder_1 = require("../../lib/query-builder");
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
async function createSale(input, soldBy) {
    const session = await mongoose_1.default.startSession();
    let sale;
    let stockSnapshots = [];
    try {
        await session.withTransaction(async () => {
            const items = [];
            let grandTotal = 0;
            stockSnapshots = [];
            for (const line of input.items) {
                const product = await product_model_1.Product.findById(line.product).session(session);
                if (!product)
                    throw new errors_1.NotFoundError(`Product ${line.product} not found`);
                if (product.stockQuantity < line.quantity) {
                    throw new errors_1.BadRequestError(`Insufficient stock for "${product.name}" — available: ${product.stockQuantity}, requested: ${line.quantity}`);
                }
                product.stockQuantity -= line.quantity;
                await product.save({ session });
                const subtotal = product.sellingPrice * line.quantity;
                grandTotal += subtotal;
                items.push({
                    product: product._id,
                    productName: product.name,
                    quantity: line.quantity,
                    unitPrice: product.sellingPrice,
                    subtotal,
                });
                stockSnapshots.push({
                    _id: product._id,
                    name: product.name,
                    sku: product.sku,
                    stockQuantity: product.stockQuantity,
                });
            }
            const createdSales = await sale_model_1.Sale.create([{ items, grandTotal, soldBy }], { session });
            sale = createdSales[0];
        });
    }
    finally {
        await session.endSession();
    }
    // Only broadcast low-stock warnings once the transaction is safely committed.
    for (const snapshot of stockSnapshots)
        (0, low_stock_service_1.checkLowStock)(snapshot);
    return sale;
}
async function listSales(query) {
    const parsed = (0, query_builder_1.parseListQuery)(query, { maxLimit: 100, defaultSort: '-createdAt' });
    const [items, total] = await Promise.all([
        sale_model_1.Sale.find()
            .populate('soldBy', 'name email')
            .sort(parsed.sort)
            .skip(parsed.skip)
            .limit(parsed.limit),
        sale_model_1.Sale.countDocuments(),
    ]);
    return { items, meta: (0, query_builder_1.buildMeta)(parsed, total) };
}
async function getSaleById(id) {
    const sale = await sale_model_1.Sale.findById(id).populate('soldBy', 'name email');
    if (!sale)
        throw new errors_1.NotFoundError('Sale not found');
    return sale;
}
//# sourceMappingURL=sale.service.js.map