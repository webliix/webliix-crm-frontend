export const ErrorCodes = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION: 422,
  SERVER_ERROR: 500,
  NETWORK_ERROR: 0,
  UNKNOWN_ERROR: -1,
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
