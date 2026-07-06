"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
const product_model_1 = require("../products/product.model");
const sale_model_1 = require("../sales/sale.model");
const low_stock_service_1 = require("../inventory/low-stock.service");
async function getDashboardStats() {
    const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
        product_model_1.Product.countDocuments(),
        sale_model_1.Sale.countDocuments(),
        product_model_1.Product.find({ stockQuantity: { $lt: low_stock_service_1.LOW_STOCK_THRESHOLD } })
            .select('name sku stockQuantity')
            .sort('stockQuantity'),
    ]);
    return { totalProducts, totalSales, lowStockProducts };
}
//# sourceMappingURL=dashboard.service.js.map