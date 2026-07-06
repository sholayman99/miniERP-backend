"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserActiveHandler = exports.createUserHandler = exports.listUsersHandler = void 0;
const async_handler_1 = require("../../lib/async-handler");
const response_1 = require("../../lib/response");
const errors_1 = require("../../lib/errors");
const user_model_1 = require("./user.model");
const role_model_1 = require("../roles/role.model");
const password_1 = require("../auth/password");
exports.listUsersHandler = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const users = await user_model_1.User.find().populate('role', 'name label');
    return (0, response_1.ok)(res, users);
});
exports.createUserHandler = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { name, email, password, roleId } = req.body;
    const existing = await user_model_1.User.findOne({ email });
    if (existing)
        throw new errors_1.ConflictError('Email already in use');
    const role = await role_model_1.Role.findById(roleId);
    if (!role)
        throw new errors_1.NotFoundError('Role not found');
    const hashed = await (0, password_1.hashPassword)(password);
    const user = await user_model_1.User.create({ name, email, password: hashed, role: role._id });
    const safe = user.toObject();
    delete safe.password;
    return (0, response_1.created)(res, safe);
});
exports.setUserActiveHandler = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const user = await user_model_1.User.findById(req.params.id);
    if (!user)
        throw new errors_1.NotFoundError('User not found');
    user.isActive = req.body.isActive;
    await user.save();
    return (0, response_1.ok)(res, user);
});
//# sourceMappingURL=user.controller.js.map