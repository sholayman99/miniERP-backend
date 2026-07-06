import { Schema, model, Types, InferSchemaType } from 'mongoose'

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    permissions: [{ type: Types.ObjectId, ref: 'Permission' }],
    // Seeded system roles (admin/manager/employee) are protected from deletion
    // in your future roles controller — check this flag before allowing delete.
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export type RoleDoc = InferSchemaType<typeof roleSchema>

export const Role = model('Role', roleSchema)
