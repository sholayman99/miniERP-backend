"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserActiveSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('A valid email is required'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    roleId: objectId,
});
exports.setUserActiveSchema = zod_1.z.object({
    isActive: zod_1.z.boolean(),
});
//# sourceMappingURL=user.validation.js.map