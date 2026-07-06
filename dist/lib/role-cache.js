"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRolePermissions = getRolePermissions;
exports.invalidateRoleCache = invalidateRoleCache;
const role_model_1 = require("../modules/roles/role.model");
const CACHE_TTL_MS = 30_000;
const cache = new Map();
/**
 * Returns the set of permission keys for a given roleId.
 * Cached for CACHE_TTL_MS so permission checks stay dynamic (DB-driven)
 * without a DB round trip on every single request.
 */
async function getRolePermissions(roleId) {
    const cached = cache.get(roleId);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.permissions;
    }
    const role = await role_model_1.Role.findById(roleId).populate('permissions', 'key').lean();
    const permissions = new Set((role?.permissions ?? []).map((p) => p.key));
    cache.set(roleId, { permissions, expiresAt: Date.now() + CACHE_TTL_MS });
    return permissions;
}
/** Call this from your roles controller after updating a role's permissions,
 * so the change is picked up immediately instead of waiting for TTL expiry. */
function invalidateRoleCache(roleId) {
    if (roleId) {
        cache.delete(roleId);
    }
    else {
        cache.clear();
    }
}
//# sourceMappingURL=role-cache.js.map