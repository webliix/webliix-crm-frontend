import type { AppError } from "./AppError";
import { ErrorCodes } from "./ErrorCodes";
import { notificationService } from "@/shared/notifications/notification.service";

export interface ErrorContext {
  code?: number;
  message?: string;
  timestamp?: Date;
  context?: Record<string, any>;
}

export class ErrorHandler {
  private listeners: Array<(error: ErrorContext) => void> = [];

  /**
   * Handle an error and notify listeners
   */
  handle(error: AppError | Error | string): void {
    const errorContext = this.normalize(error);
    const message =
      errorContext.message || this.getMessageForCode(errorContext.code ?? 0);

    notificationService.error(message);
    this.notifyListeners(errorContext);
  }

  /**
   * Normalize error to ErrorContext
   */
  private normalize(error: AppError | Error | string): ErrorContext {
    if (typeof error === "string") {
      return {
        message: error,
        timestamp: new Date(),
      };
    }

    if (error instanceof Error && "code" in error) {
      return {
        code: (error as any).code,
        message: error.message,
        timestamp: new Date(),
      };
    }

    return {
      message: error.message || "Unknown error",
      timestamp: new Date(),
    };
  }

  /**
   * Subscribe to error events
   */
  subscribe(listener: (error: ErrorContext) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(error: ErrorContext): void {
    this.listeners.forEach((listener) => {
      try {
        listener(error);
      } catch (e) {
        console.error("Error in error listener:", e);
      }
    });
  }

  /**
   * Get user-friendly message based on error code
   */
  getMessageForCode(code: number): string {
    switch (code) {
      case ErrorCodes.UNAUTHORIZED:
        return "Please log in again";
      case ErrorCodes.FORBIDDEN:
        return "You don't have permission for this action";
      case ErrorCodes.NOT_FOUND:
        return "Resource not found";
      case ErrorCodes.CONFLICT:
        return "This action conflicts with existing data";
      case ErrorCodes.VALIDATION:
        return "Please check your input and try again";
      case ErrorCodes.SERVER_ERROR:
        return "Server error. Please try again later";
      case ErrorCodes.NETWORK_ERROR:
        return "Network error. Please check your connection";
      default:
        return "An error occurred. Please try again";
    }
  }
}

export const errorHandler = new ErrorHandler();
