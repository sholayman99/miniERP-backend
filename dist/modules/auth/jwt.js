"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const env_1 = require("../../config/env");
function signAccessToken(params) {
    const sid = (0, crypto_1.randomUUID)();
    const payload = {
        sub: params.userId,
        sid,
        type: 'user',
        role: params.roleId,
    };
    const token = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_SECRET, {
        algorithm: 'HS256',
        expiresIn: `${env_1.env.JWT_ACCESS_TTL_MIN}m`,
    });
    return { token, sid };
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] });
}
//# sourceMappingURL=jwt.js.map