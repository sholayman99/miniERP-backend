import { Schema, model, Types, InferSchemaType } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: Types.ObjectId, ref: 'Role', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId }

export const User = model('User', userSchema)
