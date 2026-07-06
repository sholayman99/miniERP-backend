"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOW_STOCK_THRESHOLD = void 0;
exports.checkLowStock = checkLowStock;
const logger_1 = require("../../lib/logger");
exports.LOW_STOCK_THRESHOLD = 5;
/**
 * Call this right after a product's stockQuantity changes — e.g. at the end
 * of a sale-creation transaction, and after a manual product-quantity edit.
 */
function checkLowStock(product) {
    if (product.stockQuantity < exports.LOW_STOCK_THRESHOLD) {
        logger_1.logger.warn({ productId: String(product._id), sku: product.sku, stockQuantity: product.stockQuantity }, 'low_stock');
    }
}
//# sourceMappingURL=low-stock.service.js.map