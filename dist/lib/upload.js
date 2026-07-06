"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImage = void 0;
exports.uploadToCloudinary = uploadToCloudinary;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
const errors_1 = require("./errors");
cloudinary_1.v2.config({
    cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.env.CLOUDINARY_API_KEY,
    api_secret: env_1.env.CLOUDINARY_API_SECRET,
});
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
exports.uploadProductImage = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME.includes(file.mimetype)) {
            return cb(new errors_1.BadRequestError('Only JPEG, PNG or WEBP images are allowed'));
        }
        cb(null, true);
    },
});
function uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'erp/products', resource_type: 'image' }, (err, result) => {
            if (err || !result)
                return reject(err ?? new Error('Cloudinary upload failed'));
            resolve(result.secure_url);
        });
        stream.end(buffer);
    });
}
//# sourceMappingURL=upload.js.map