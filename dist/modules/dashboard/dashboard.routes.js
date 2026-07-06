"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const require_auth_1 = require("../../middleware/require-auth");
const require_permission_1 = require("../../middleware/require-permission");
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
router.use((0, require_auth_1.requireAuth)());
router.get('/', (0, require_permission_1.requirePermission)('dashboard:read'), dashboard_controller_1.getDashboardStatsHandler);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map