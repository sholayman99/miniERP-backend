import type { Request, Response } from 'express'
import { asyncHandler } from '../../lib/async-handler'
import { ok } from '../../lib/response'
import { NotFoundError, BadRequestError } from '../../lib/errors'
import { Role } from './role.model'
import { Permission } from '../permissions/permission.model'
import { invalidateRoleCache } from '../../lib/role-cache'

export const listRolesHandler = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await Role.find().populate('permissions', 'key label module action')
  return ok(res, roles)
})

export const getRoleHandler = asyncHandler(async (req: Request, res: Response) => {
  const role = await Role.findById(req.params.id).populate('permissions', 'key label module action')
  if (!role) throw new NotFoundError('Role not found')
  return ok(res, role)
})

// body: { permissions: string[] } — array of Permission ObjectIds
export const updateRolePermissionsHandler = asyncHandler(async (req: Request, res: Response) => {
  const role = await Role.findById(req.params.id)
  if (!role) throw new NotFoundError('Role not found')

  const permissionIds: string[] = req.body.permissions
  const found = await Permission.countDocuments({ _id: { $in: permissionIds } })
  if (found !== new Set(permissionIds).size) {
    throw new BadRequestError('One or more permissions do not exist')
  }

  role.set('permissions', permissionIds)
  await role.save()

  // Without this, holders of this role would keep old permissions until the
  // short in-memory cache (role-cache.ts) naturally expires.
  invalidateRoleCache(String(role._id))

  return ok(res, role)
})
