import { Schema, model, InferSchemaType } from 'mongoose'

const permissionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    module: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { timestamps: true },
)

export type PermissionDoc = InferSchemaType<typeof permissionSchema>

export const Permission = model('Permission', permissionSchema)
