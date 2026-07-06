export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown, message = 'Validation failed') {
    super(400, 'VALIDATION_ERROR', message, details)
    this.name = 'ValidationError'
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: unknown) {
    super(400, 'BAD_REQUEST', message, details)
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(404, 'NOT_FOUND', `${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, 'CONFLICT', message)
    this.name = 'ConflictError'
  }
}

export class UnprocessableError extends AppError {
  constructor(code: string, message: string) {
    super(422, code, message)
    this.name = 'UnprocessableError'
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfterSeconds: number) {
    super(429, 'RATE_LIMITED', 'Too many requests', { retryAfterSeconds })
    this.name = 'RateLimitError'
  }
}
