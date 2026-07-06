"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = seedUsers;
const user_model_1 = require("../src/modules/users/user.model");
const role_model_1 = require("../src/modules/roles/role.model");
const password_1 = require("../src/modules/auth/password");
// Plain-text passwords are only ever used here, at seed time, to produce the
// hash. Change these via env vars before a public deploy if you want.
const TEST_USERS = [
    {
        name: 'Admin User',
        email: process.env.SEED_ADMIN_EMAIL ?? 'admin@erp.test',
        password: process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123',
        roleName: 'admin',
    },
    {
        name: 'Manager User',
        email: process.env.SEED_MANAGER_EMAIL ?? 'manager@erp.test',
        password: process.env.SEED_MANAGER_PASSWORD ?? 'Manager@123',
        roleName: 'manager',
    },
    {
        name: 'Employee User',
        email: process.env.SEED_EMPLOYEE_EMAIL ?? 'employee@erp.test',
        password: process.env.SEED_EMPLOYEE_PASSWORD ?? 'Employee@123',
        roleName: 'employee',
    },
];
async function seedUsers() {
    for (const u of TEST_USERS) {
        const role = await role_model_1.Role.findOne({ name: u.roleName });
        if (!role) {
            console.warn(`⚠ Role "${u.roleName}" not found — run seed-roles first. Skipping ${u.email}`);
            continue;
        }
        const password = await (0, password_1.hashPassword)(u.password);
        await user_model_1.User.findOneAndUpdate({ email: u.email }, { $set: { name: u.name, password, role: role._id, isActive: true } }, { upsert: true, new: true });
    }
    console.log(`✔ Seeded ${TEST_USERS.length} test users`);
    console.table(TEST_USERS.map(({ email, password, roleName }) => ({ email, password, role: roleName })));
}
//# sourceMappingURL=seed-users.js.map