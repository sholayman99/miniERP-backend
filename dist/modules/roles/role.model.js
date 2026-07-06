"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    permissions: [{ type: mongoose_1.Types.ObjectId, ref: 'Permission' }],
    // Seeded system roles (admin/manager/employee) are protected from deletion
    // in your future roles controller — check this flag before allowing delete.
    isSystem: { type: Boolean, default: false },
}, { timestamps: true });
exports.Role = (0, mongoose_1.model)('Role', roleSchema);
//# sourceMappingURL=role.model.js.map