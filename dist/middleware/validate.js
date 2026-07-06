"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
const errors_1 = require("../lib/errors");
function validateBody(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(new errors_1.BadRequestError('Validation failed', result.error.flatten()));
        }
        req.body = result.data;
        next();
    };
}
function validateQuery(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            return next(new errors_1.BadRequestError('Invalid query params', result.error.flatten()));
        }
        // req.query is read-only in newer Express types — cast to assign safely.
        Object.assign(req.query, result.data);
        next();
    };
}
//# sourceMappingURL=validate.js.map