"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPermissionsHandler = void 0;
const async_handler_1 = require("../../lib/async-handler");
const response_1 = require("../../lib/response");
const permission_model_1 = require("./permission.model");
exports.listPermissionsHandler = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const permissions = await permission_model_1.Permission.find().sort('module action');
    return (0, response_1.ok)(res, permissions);
});
//# sourceMappingURL=permission.controller.js.map