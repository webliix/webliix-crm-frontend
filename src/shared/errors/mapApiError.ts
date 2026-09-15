import { ErrorCodes, type ErrorCode } from "./ErrorCodes";
import { ErrorMessages } from "./ErrorMessages";
import { ApiError, ValidationError, AuthorizationError, NotFoundError } from "./AppError";

interface ApiErrorResponse {
  status?: number;
  message?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export function mapApiError(error: any): ApiError {
  // Handle network errors
  if (error.message === "Network Error" || !error.response) {
    return new ApiError(ErrorMessages.networkError, ErrorCodes.NETWORK_ERROR);
  }

  const status = error.response?.status;
  const data = error.response?.data as ApiErrorResponse | undefined;
  const message = data?.message || error.message || "";

  // Map specific error codes
  switch (status) {
    case ErrorCodes.UNAUTHORIZED:
      return new ApiError(ErrorMessages.unauthorized, ErrorCodes.UNAUTHORIZED);

    case ErrorCodes.FORBIDDEN:
      return new AuthorizationError(ErrorMessages.forbidden);

    case ErrorCodes.NOT_FOUND:
      return new NotFoundError(data?.message || ErrorMessages.notFound);

    case ErrorCodes.CONFLICT:
      return new ApiError(data?.message || ErrorMessages.conflict, ErrorCodes.CONFLICT);

    case ErrorCodes.VALIDATION:
      return new ValidationError(
        data?.message || ErrorMessages.validation,
        data?.errors,
      );

    case ErrorCodes.SERVER_ERROR:
      return new ApiError(
        data?.message || ErrorMessages.serverError,
        ErrorCodes.SERVER_ERROR,
      );

    default:
      return new ApiError(message || ErrorMessages.unknown, status || ErrorCodes.UNKNOWN_ERROR as ErrorCode);
  }
}
