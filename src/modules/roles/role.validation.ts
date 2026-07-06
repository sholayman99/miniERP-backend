import { z } from 'zod'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

export const updateRolePermissionsSchema = z.object({
  permissions: z.array(objectId),
})
