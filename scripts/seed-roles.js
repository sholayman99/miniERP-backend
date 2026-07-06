"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRoles = seedRoles;
const role_model_1 = require("../src/modules/roles/role.model");
const permission_model_1 = require("../src/modules/permissions/permission.model");
const permission_constants_1 = require("../src/modules/permissions/permission.constants");
async function seedRoles() {
    for (const [roleName, permKeys] of Object.entries(permission_constants_1.ROLE_PERMISSION_MAP)) {
        const permissionDocs = await permission_model_1.Permission.find({ key: { $in: permKeys } }, '_id');
        await role_model_1.Role.findOneAndUpdate({ name: roleName }, {
            $set: {
                label: permission_constants_1.ROLE_LABELS[roleName],
                permissions: permissionDocs.map((p) => p._id),
                isSystem: true,
            },
        }, { upsert: true, new: true });
    }
    console.log(`✔ Seeded ${Object.keys(permission_constants_1.ROLE_PERMISSION_MAP).length} roles (admin, manager, employee)`);
}
//# sourceMappingURL=seed-roles.js.map