import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { env } from '../config/env'
import { BadRequestError } from './errors'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

export const uploadProductImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new BadRequestError('Only JPEG, PNG or WEBP images are allowed'))
    }
    cb(null, true)
  },
})

export function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'erp/products', resource_type: 'image' },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Cloudinary upload failed'))
        resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}
