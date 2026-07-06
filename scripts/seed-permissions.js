"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = seedPermissions;
const permission_model_1 = require("../src/modules/permissions/permission.model");
const permission_constants_1 = require("../src/modules/permissions/permission.constants");
async function seedPermissions() {
    for (const perm of permission_constants_1.PERMISSIONS) {
        await permission_model_1.Permission.findOneAndUpdate({ key: perm.key }, { $set: perm }, { upsert: true, new: true });
    }
    // Remove any permissions no longer defined in the source of truth.
    const validKeys = permission_constants_1.PERMISSIONS.map((p) => p.key);
    await permission_model_1.Permission.deleteMany({ key: { $nin: validKeys } });
    console.log(`✔ Seeded ${permission_constants_1.PERMISSIONS.length} permissions`);
}
//# sourceMappingURL=seed-permissions.js.map