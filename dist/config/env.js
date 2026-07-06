"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = exports.isProd = exports.env = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
const envCandidates = [
    node_path_1.default.resolve(__dirname, '../../.env'),
    node_path_1.default.resolve(process.cwd(), '.env'),
    node_path_1.default.resolve(process.cwd(), 'backend/.env'),
].filter((candidate, index, list) => list.indexOf(candidate) === index);
const envFile = envCandidates.find((candidate) => (0, node_fs_1.existsSync)(candidate));
if (envFile && process.env.NODE_ENV !== 'test') {
    (0, dotenv_1.config)({ path: envFile });
}
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: zod_1.z.coerce.number().int().positive().default(4000),
    ADMIN_URL: zod_1.z.string().url().default('http://localhost:3000'),
    MONGODB_URI: zod_1.z
        .string()
        .min(1)
        .default('mongodb://127.0.0.1:27017/erp-management'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16).default('dev-jwt-secret-change-me'),
    JWT_ACCESS_TTL_MIN: zod_1.z.coerce.number().int().positive().default(1440),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().min(1).default('demo-cloud'),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1).default('demo-key'),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1).default('demo-secret'),
    SENTRY_DSN: zod_1.z.string().optional(),
    LOG_LEVEL: zod_1.z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
exports.isProd = exports.env.NODE_ENV === 'production';
exports.isDev = exports.env.NODE_ENV === 'development';
//# sourceMappingURL=env.js.map