"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductHandler = exports.updateProductHandler = exports.getProductHandler = exports.listProductsHandler = exports.createProductHandler = void 0;
const async_handler_1 = require("../../lib/async-handler");
const response_1 = require("../../lib/response");
const errors_1 = require("../../lib/errors");
const low_stock_service_1 = require("../inventory/low-stock.service");
const upload_1 = require("../../lib/upload");
const productService = __importStar(require("./product.service"));
function getUploadedFiles(req) {
    if (Array.isArray(req.files)) {
        return req.files;
    }
    const files = [];
    const fileFields = req.files;
    if (fileFields) {
        for (const key of Object.keys(fileFields)) {
            const value = fileFields[key];
            if (Array.isArray(value))
                files.push(...value);
        }
    }
    return files;
}
exports.createProductHandler = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const files = getUploadedFiles(req);
    if (files.length === 0)
        throw new errors_1.BadRequestError('Product image is required');
    const imageUrls = await Promise.all(files.slice(0, 3).map((file) => (0, upload_1.uploadToCloudinary)(file.buffer)));
    const product = await productService.createProduct(req.body, imageUrls);
    return (0, response_1.created)(res, product);
});
exports.listProductsHandler = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { items, meta } = await productService.listProducts(req.query);
    return (0, response_1.ok)(res, items, meta);
});
exports.getProductHandler = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    return (0, response_1.ok)(res, product);
});
exports.updateProductHandler = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const files = getUploadedFiles(req);
    const imageUrls = files.length
        ? await Promise.all(files.slice(0, 3).map((file) => (0, upload_1.uploadToCloudinary)(file.buffer)))
        : undefined;
    const product = await productService.updateProduct(req.params.id, req.body, imageUrls);
    (0, low_stock_service_1.checkLowStock)(product); // manual stock edits can also cross the threshold
    return (0, response_1.ok)(res, product);
});
exports.deleteProductHandler = (0, async_handler_1.asyncHandler)(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    return (0, response_1.ok)(res, { deleted: true });
});
//# sourceMappingURL=product.controller.js.map