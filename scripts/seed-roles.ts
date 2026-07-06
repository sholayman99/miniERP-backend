import { Role } from '../src/modules/roles/role.model'
import { Permission } from '../src/modules/permissions/permission.model'
import { ROLE_PERMISSION_MAP, ROLE_LABELS } from '../src/modules/permissions/permission.constants'

export async function seedRoles() {
  for (const [roleName, permKeys] of Object.entries(ROLE_PERMISSION_MAP)) {
    const permissionDocs = await Permission.find({ key: { $in: permKeys } }, '_id')

    await Role.findOneAndUpdate(
      { name: roleName },
      {
        $set: {
          label: ROLE_LABELS[roleName as keyof typeof ROLE_LABELS],
          permissions: permissionDocs.map((p) => p._id),
          isSystem: true,
        },
      },
      { upsert: true, new: true },
    )
  }
  console.log(`✔ Seeded ${Object.keys(ROLE_PERMISSION_MAP).length} roles (admin, manager, employee)`)
}
