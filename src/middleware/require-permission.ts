import type { Request, Response, NextFunction } from 'express'
import { ForbiddenError, UnauthorizedError } from '../lib/errors'
import { getRolePermissions } from '../lib/role-cache'
import type { PermissionKey } from '../modules/permissions/permission.constants'

/**
 * Dynamic replacement for the old static adminHasPermission() check.
 * Permissions live in the database (Permission + Role collections), so
 * changing a role's permissions takes effect for every user with that
 * role without needing a redeploy — only a short cache TTL (see role-cache.ts).
 */
export function requirePermission(perm: PermissionKey) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth || req.auth.type !== 'user') {
      return next(new UnauthorizedError())
    }

    const roleId = req.auth.role
    if (!roleId) return next(new ForbiddenError('Role missing'))

    try {
      const permissions = await getRolePermissions(roleId)
      if (!permissions.has(perm)) {
        return next(new ForbiddenError(`Missing permission: ${perm}`))
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}
