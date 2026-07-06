"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const multer_1 = require("multer");
const errors_1 = require("../lib/errors");
const sentry_1 = require("../lib/sentry");
const logger_1 = require("../lib/logger");
const response_1 = require("../lib/response");
const env_1 = require("../config/env");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        return (0, response_1.fail)(res, 400, 'VALIDATION_ERROR', 'Validation failed', err.flatten());
    }
    if (err instanceof errors_1.AppError) {
        return (0, response_1.fail)(res, err.status, err.code, err.message, err.details);
    }
    // Malformed ObjectId (e.g. GET /products/:id with a bad id) → 400, not 500.
    if (err instanceof Error && err.name === 'CastError') {
        return (0, response_1.fail)(res, 400, 'BAD_REQUEST', 'Invalid identifier');
    }
    // Unique-index violation (SKU / email race) → 409, not 500.
    if (typeof err === 'object' &&
        err !== null &&
        err.code === 11000) {
        return (0, response_1.fail)(res, 409, 'CONFLICT', 'A record with these details already exists');
    }
    // File-upload errors (size limit, unexpected field) → 400, not 500.
    if (err instanceof multer_1.MulterError) {
        return (0, response_1.fail)(res, 400, 'BAD_REQUEST', err.message);
    }
    (0, sentry_1.captureException)(err);
    logger_1.logger.error({ err }, 'unhandled_error');
    return (0, response_1.fail)(res, 500, 'INTERNAL_ERROR', env_1.isProd ? 'Internal server error' : err.message);
}
//# sourceMappingURL=error-handler.js.map