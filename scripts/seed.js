"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = require("../src/lib/mongo");
const seed_permissions_1 = require("./seed-permissions");
const seed_roles_1 = require("./seed-roles");
const seed_users_1 = require("./seed-users");
async function main() {
    await (0, mongo_1.connectMongo)();
    await (0, seed_permissions_1.seedPermissions)();
    await (0, seed_roles_1.seedRoles)(); // depends on permissions existing
    await (0, seed_users_1.seedUsers)(); // depends on roles existing
    await (0, mongo_1.disconnectMongo)();
    console.log('✅ Seed complete');
    process.exit(0);
}
main().catch((err) => {
    console.error('❌ Seed failed', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map