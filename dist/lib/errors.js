"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitError = exports.UnprocessableError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    status;
    code;
    details;
    constructor(status, code, message, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(details, message = 'Validation failed') {
        super(400, 'VALIDATION_ERROR', message, details);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class BadRequestError extends AppError {
    constructor(message = 'Bad request', details) {
        super(400, 'BAD_REQUEST', message, details);
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, 'UNAUTHORIZED', message);
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(403, 'FORBIDDEN', message);
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(404, 'NOT_FOUND', `${resource} not found`);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(409, 'CONFLICT', message);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
class UnprocessableError extends AppError {
    constructor(code, message) {
        super(422, code, message);
        this.name = 'UnprocessableError';
    }
}
exports.UnprocessableError = UnprocessableError;
class RateLimitError extends AppError {
    constructor(retryAfterSeconds) {
        super(429, 'RATE_LIMITED', 'Too many requests', { retryAfterSeconds });
        this.name = 'RateLimitError';
    }
}
exports.RateLimitError = RateLimitError;
//# sourceMappingURL=errors.js.map