"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRolePermissionsSchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');
exports.updateRolePermissionsSchema = zod_1.z.object({
    permissions: zod_1.z.array(objectId),
});
//# sourceMappingURL=role.validation.js.map