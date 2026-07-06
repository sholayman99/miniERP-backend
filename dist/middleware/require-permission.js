"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
const errors_1 = require("../lib/errors");
const role_cache_1 = require("../lib/role-cache");
/**
 * Dynamic replacement for the old static adminHasPermission() check.
 * Permissions live in the database (Permission + Role collections), so
 * changing a role's permissions takes effect for every user with that
 * role without needing a redeploy — only a short cache TTL (see role-cache.ts).
 */
function requirePermission(perm) {
    return async (req, _res, next) => {
        if (!req.auth || req.auth.type !== 'user') {
            return next(new errors_1.UnauthorizedError());
        }
        const roleId = req.auth.role;
        if (!roleId)
            return next(new errors_1.ForbiddenError('Role missing'));
        try {
            const permissions = await (0, role_cache_1.getRolePermissions)(roleId);
            if (!permissions.has(perm)) {
                return next(new errors_1.ForbiddenError(`Missing permission: ${perm}`));
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
//# sourceMappingURL=require-permission.js.map