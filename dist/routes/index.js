"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const product_routes_1 = __importDefault(require("../modules/products/product.routes"));
const sale_routes_1 = __importDefault(require("../modules/sales/sale.routes"));
const dashboard_routes_1 = __importDefault(require("../modules/dashboard/dashboard.routes"));
const role_routes_1 = __importDefault(require("../modules/roles/role.routes"));
const permission_routes_1 = __importDefault(require("../modules/permissions/permission.routes"));
const user_routes_1 = __importDefault(require("../modules/users/user.routes"));
const rate_limit_1 = require("../middleware/rate-limit");
const router = (0, express_1.Router)();
router.use('/auth', (0, rate_limit_1.rlByIp)('auth', 60, 60), auth_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/sales', (0, rate_limit_1.rlByIp)('sales', 30, 60), sale_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/roles', role_routes_1.default);
router.use('/permissions', permission_routes_1.default);
router.use('/users', user_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map