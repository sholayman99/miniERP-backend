"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.getMe = getMe;
const user_model_1 = require("../users/user.model");
const password_1 = require("./password");
const jwt_1 = require("./jwt");
const errors_1 = require("../../lib/errors");
const role_cache_1 = require("../../lib/role-cache");
async function login(input) {
    const user = await user_model_1.User.findOne({ email: input.email, isActive: true })
        .select('+password')
        .populate('role', 'name label');
    if (!user)
        throw new errors_1.UnauthorizedError('Invalid email or password');
    const isValid = await (0, password_1.comparePassword)(input.password, user.password);
    if (!isValid)
        throw new errors_1.UnauthorizedError('Invalid email or password');
    const role = user.role;
    const { token } = (0, jwt_1.signAccessToken)({ userId: String(user._id), roleId: String(role._id) });
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: { id: role._id, name: role.name, label: role.label },
        },
    };
}
async function getMe(userId, roleId) {
    const user = await user_model_1.User.findById(userId).populate('role', 'name label');
    if (!user)
        throw new errors_1.UnauthorizedError('User not found');
    const role = user.role;
    const permissions = await (0, role_cache_1.getRolePermissions)(roleId);
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: { name: role.name, label: role.label },
        permissions: Array.from(permissions),
    };
}
//# sourceMappingURL=auth.service.js.map