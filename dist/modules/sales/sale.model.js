"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sale = void 0;
const mongoose_1 = require("mongoose");
const saleItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true }, // snapshot, survives later product edits
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }, // snapshot of sellingPrice at sale time
    subtotal: { type: Number, required: true, min: 0 },
}, { _id: false });
const saleSchema = new mongoose_1.Schema({
    items: {
        type: [saleItemSchema],
        required: true,
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: 'A sale must contain at least one item',
        },
    },
    grandTotal: { type: Number, required: true, min: 0 },
    soldBy: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
exports.Sale = (0, mongoose_1.model)('Sale', saleSchema);
//# sourceMappingURL=sale.model.js.map