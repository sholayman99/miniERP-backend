import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  ADMIN_URL: z.string().url().default('http://localhost:3000'),

  MONGODB_URI: z
    .string()
    .min(1)
    .default('mongodb://127.0.0.1:27017/erp-management'),

  JWT_ACCESS_SECRET: z.string().min(16).default('dev-jwt-secret-change-me'),
  JWT_ACCESS_TTL_MIN: z.coerce.number().int().positive().default(1440),

  CLOUDINARY_CLOUD_NAME: z.string().min(1).default('demo-cloud'),
  CLOUDINARY_API_KEY: z.string().min(1).default('demo-key'),
  CLOUDINARY_API_SECRET: z.string().min(1).default('demo-secret'),

  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';
