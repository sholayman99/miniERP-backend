"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = require("express");
const async_handler_1 = require("../../lib/async-handler");
const health_controller_1 = require("./health.controller");
const router = (0, express_1.Router)();
router.get('/', (0, async_handler_1.asyncHandler)(health_controller_1.healthController.shallow));
router.get('/deep', (0, async_handler_1.asyncHandler)(health_controller_1.healthController.deep));
exports.healthRouter = router;
//# sourceMappingURL=health.routes.js.map