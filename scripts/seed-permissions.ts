import { Permission } from '../src/modules/permissions/permission.model'
import { PERMISSIONS } from '../src/modules/permissions/permission.constants'

export async function seedPermissions() {
  for (const perm of PERMISSIONS) {
    await Permission.findOneAndUpdate({ key: perm.key }, { $set: perm }, { upsert: true, new: true })
  }
  // Remove any permissions no longer defined in the source of truth.
  const validKeys = PERMISSIONS.map((p) => p.key)
  await Permission.deleteMany({ key: { $nin: validKeys } })
  console.log(`✔ Seeded ${PERMISSIONS.length} permissions`)
}
