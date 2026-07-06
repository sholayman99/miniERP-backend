import { describe, expect, it } from 'vitest';
import { PERMISSIONS, ROLE_PERMISSION_MAP } from './permission.constants';

describe('role-based permissions', () => {
  it('gives admin full access', () => {
    expect(ROLE_PERMISSION_MAP.admin).toEqual(
      PERMISSIONS.map((permission) => permission.key)
    );
  });

  it('gives manager product management and sales creation permissions', () => {
    expect(ROLE_PERMISSION_MAP.manager).toEqual([
      'products:create',
      'products:read',
      'products:update',
      'products:delete',
      'sales:create',
    ]);
  });

  it('gives employee view products and sales creation permissions', () => {
    expect(ROLE_PERMISSION_MAP.employee).toEqual([
      'products:read',
      'sales:create',
    ]);
  });
});
