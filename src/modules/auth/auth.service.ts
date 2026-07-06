import { User } from '../users/user.model'
import { comparePassword } from './password'
import { signAccessToken } from './jwt'
import { UnauthorizedError } from '../../lib/errors'
import { getRolePermissions } from '../../lib/role-cache'
import type { LoginInput } from './auth.validation'

export async function login(input: LoginInput) {
  const user = await User.findOne({ email: input.email, isActive: true })
    .select('+password')
    .populate('role', 'name label')

  if (!user) throw new UnauthorizedError('Invalid email or password')

  const isValid = await comparePassword(input.password, user.password)
  if (!isValid) throw new UnauthorizedError('Invalid email or password')

  const role = user.role as unknown as { _id: unknown; name: string; label: string }
  const { token } = signAccessToken({ userId: String(user._id), roleId: String(role._id) })

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: { id: role._id, name: role.name, label: role.label },
    },
  }
}

export async function getMe(userId: string, roleId: string) {
  const user = await User.findById(userId).populate('role', 'name label')
  if (!user) throw new UnauthorizedError('User not found')

  const role = user.role as unknown as { name: string; label: string }
  const permissions = await getRolePermissions(roleId)

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: { name: role.name, label: role.label },
    permissions: Array.from(permissions),
  }
}
