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
const express_1 = require("express");
const require_auth_1 = require("../../middleware/require-auth");
const require_permission_1 = require("../../middleware/require-permission");
const validate_1 = require("../../middleware/validate");
const upload_1 = require("../../lib/upload");
const product_validation_1 = require("./product.validation");
const controller = __importStar(require("./product.controller"));
const router = (0, express_1.Router)();
router.use((0, require_auth_1.requireAuth)());
router.get('/', (0, require_permission_1.requirePermission)('products:read'), (0, validate_1.validateQuery)(product_validation_1.listProductsQuerySchema), controller.listProductsHandler);
router.get('/:id', (0, require_permission_1.requirePermission)('products:read'), controller.getProductHandler);
router.post('/', (0, require_permission_1.requirePermission)('products:create'), upload_1.uploadProductImage.any(), (0, validate_1.validateBody)(product_validation_1.createProductSchema), controller.createProductHandler);
router.put('/:id', (0, require_permission_1.requirePermission)('products:update'), upload_1.uploadProductImage.any(), (0, validate_1.validateBody)(product_validation_1.updateProductSchema), controller.updateProductHandler);
router.delete('/:id', (0, require_permission_1.requirePermission)('products:delete'), controller.deleteProductHandler);
exports.default = router;
//# sourceMappingURL=product.routes.js.map