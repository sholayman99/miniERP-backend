"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_LABELS = exports.ROLE_PERMISSION_MAP = exports.PERMISSIONS = void 0;
// Single source of truth for every permission in the system.
// Seeders read this to populate the `Permission` collection, and to
// wire up the default Admin / Manager / Employee roles.
exports.PERMISSIONS = [
    {
        key: 'products:create',
        module: 'products',
        action: 'create',
        label: 'Create products',
    },
    {
        key: 'products:read',
        module: 'products',
        action: 'read',
        label: 'View products',
    },
    {
        key: 'products:update',
        module: 'products',
        action: 'update',
        label: 'Update products',
    },
    {
        key: 'products:delete',
        module: 'products',
        action: 'delete',
        label: 'Delete products',
    },
    {
        key: 'sales:create',
        module: 'sales',
        action: 'create',
        label: 'Create sales',
    },
    {
        key: 'sales:read',
        module: 'sales',
        action: 'read',
        label: 'View sales history',
    },
    {
        key: 'dashboard:read',
        module: 'dashboard',
        action: 'read',
        label: 'View dashboard statistics',
    },
    {
        key: 'roles:manage',
        module: 'roles',
        action: 'manage',
        label: 'Manage roles & permissions',
    },
    {
        key: 'users:manage',
        module: 'users',
        action: 'manage',
        label: 'Manage system users',
    },
];
// Matches the requested RBAC model for Admin, Manager, and Employee.
exports.ROLE_PERMISSION_MAP = {
    admin: exports.PERMISSIONS.map((p) => p.key), // Full access
    manager: [
        'products:create',
        'products:read',
        'products:update',
        'products:delete',
        'sales:create',
    ],
    employee: ['products:read', 'sales:create'],
};
exports.ROLE_LABELS = {
    admin: 'Administrator',
    manager: 'Manager',
    employee: 'Employee',
};
//# sourceMappingURL=permission.constants.js.map