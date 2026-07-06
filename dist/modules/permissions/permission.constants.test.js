"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const permission_constants_1 = require("./permission.constants");
(0, vitest_1.describe)('role-based permissions', () => {
    (0, vitest_1.it)('gives admin full access', () => {
        (0, vitest_1.expect)(permission_constants_1.ROLE_PERMISSION_MAP.admin).toEqual(permission_constants_1.PERMISSIONS.map((permission) => permission.key));
    });
    (0, vitest_1.it)('gives manager product management and sales creation permissions', () => {
        (0, vitest_1.expect)(permission_constants_1.ROLE_PERMISSION_MAP.manager).toEqual([
            'products:create',
            'products:read',
            'products:update',
            'products:delete',
            'sales:create',
        ]);
    });
    (0, vitest_1.it)('gives employee view products and sales creation permissions', () => {
        (0, vitest_1.expect)(permission_constants_1.ROLE_PERMISSION_MAP.employee).toEqual([
            'products:read',
            'sales:create',
        ]);
    });
});
//# sourceMappingURL=permission.constants.test.js.map