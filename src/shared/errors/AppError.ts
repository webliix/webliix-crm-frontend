import type { ErrorCode } from "./ErrorCodes";

export class AppError extends Error {
  constructor(
    message: string,
    public code?: ErrorCode,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ApiError extends AppError {
  constructor(
    message: string,
    code?: ErrorCode,
  ) {
    super(message, code);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message, 422);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
