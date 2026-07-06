import type { Request, Response } from 'express'
import { asyncHandler } from '../../lib/async-handler'
import { ok, created } from '../../lib/response'
import { NotFoundError, ConflictError } from '../../lib/errors'
import { User } from './user.model'
import { Role } from '../roles/role.model'
import { hashPassword } from '../auth/password'

export const listUsersHandler = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().populate('role', 'name label')
  return ok(res, users)
})

export const createUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, roleId } = req.body

  const existing = await User.findOne({ email })
  if (existing) throw new ConflictError('Email already in use')

  const role = await Role.findById(roleId)
  if (!role) throw new NotFoundError('Role not found')

  const hashed = await hashPassword(password)
  const user = await User.create({ name, email, password: hashed, role: role._id })
  const safe: Record<string, unknown> = user.toObject()
  delete safe.password
  return created(res, safe)
})

export const setUserActiveHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new NotFoundError('User not found')
  user.isActive = req.body.isActive
  await user.save()
  return ok(res, user)
})
