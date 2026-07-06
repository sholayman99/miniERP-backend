import { z } from 'zod'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('A valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleId: objectId,
})

export const setUserActiveSchema = z.object({
  isActive: z.boolean(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
