"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../modules/auth/jwt");
const errors_1 = require("../lib/errors");
const ACCESS_COOKIE = 'tp_access';
function requireAuth(userType = 'user') {
    return (req, _res, next) => {
        const header = req.headers.authorization;
        const bearer = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
        const token = bearer ?? req.cookies?.[ACCESS_COOKIE];
        if (!token)
            return next(new errors_1.UnauthorizedError('No access token'));
        try {
            const payload = (0, jwt_1.verifyAccessToken)(token);
            if (payload.type !== userType) {
                return next(new errors_1.UnauthorizedError('Wrong token type'));
            }
            req.auth = {
                userId: payload.sub,
                sessionId: payload.sid,
                type: payload.type,
                role: payload.role,
            };
            next();
        }
        catch {
            next(new errors_1.UnauthorizedError('Invalid or expired token'));
        }
    };
}
//# sourceMappingURL=require-auth.js.map