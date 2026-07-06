"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRolePermissionsHandler = exports.getRoleHandler = exports.listRolesHandler = void 0;
const async_handler_1 = require("../../lib/async-handler");
const response_1 = require("../../lib/response");
const errors_1 = require("../../lib/errors");
const role_model_1 = require("./role.model");
const permission_model_1 = require("../permissions/permission.model");
const role_cache_1 = require("../../lib/role-cache");
exports.listRolesHandler = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const roles = await role_model_1.Role.find().populate('permissions', 'key label module action');
    return (0, response_1.ok)(res, roles);
});
exports.getRoleHandler = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const role = await role_model_1.Role.findById(req.params.id).populate('permissions', 'key label module action');
    if (!role)
        throw new errors_1.NotFoundError('Role not found');
    return (0, response_1.ok)(res, role);
});
// body: { permissions: string[] } — array of Permission ObjectIds
exports.updateRolePermissionsHandler = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const role = await role_model_1.Role.findById(req.params.id);
    if (!role)
        throw new errors_1.NotFoundError('Role not found');
    const permissionIds = req.body.permissions;
    const found = await permission_model_1.Permission.countDocuments({ _id: { $in: permissionIds } });
    if (found !== new Set(permissionIds).size) {
        throw new errors_1.BadRequestError('One or more permissions do not exist');
    }
    role.set('permissions', permissionIds);
    await role.save();
    // Without this, holders of this role would keep old permissions until the
    // short in-memory cache (role-cache.ts) naturally expires.
    (0, role_cache_1.invalidateRoleCache)(String(role._id));
    return (0, response_1.ok)(res, role);
});
//# sourceMappingURL=role.controller.js.map