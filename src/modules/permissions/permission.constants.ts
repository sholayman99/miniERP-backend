// Single source of truth for every permission in the system.
// Seeders read this to populate the `Permission` collection, and to
// wire up the default Admin / Manager / Employee roles.
export const PERMISSIONS = [
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
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]['key'];

export type SeedRoleName = 'admin' | 'manager' | 'employee';

// Matches the requested RBAC model for Admin, Manager, and Employee.
export const ROLE_PERMISSION_MAP: Record<SeedRoleName, PermissionKey[]> = {
  admin: PERMISSIONS.map((p) => p.key), // Full access
  manager: [
    'products:create',
    'products:read',
    'products:update',
    'products:delete',
    'sales:create',
  ],
  employee: ['products:read', 'sales:create'],
};

export const ROLE_LABELS: Record<SeedRoleName, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  employee: 'Employee',
};
