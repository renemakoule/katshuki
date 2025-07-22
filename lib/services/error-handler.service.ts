// lib/services/error-handler.service.ts
import { NextResponse } from "next/server";
import { logger, LogCategory } from "./logger.service";
import { metricsService } from "./metrics.service";

export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400); // Bad Request
  }
}

export class TimeoutError extends CustomError {
  constructor(operation: string, timeout: number) {
    super(`Operation '${operation}' timed out after ${timeout}ms`, 504); // Gateway Timeout
  }
}

export class ExternalApiError extends CustomError {
  constructor(serviceName: string, originalError: Error) {
    super(`Error with ${serviceName}: ${originalError.message}`, 502); // Bad Gateway
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string) {
    super(`${resource} not found.`, 404); // Not Found
  }
}

export class RateLimitError extends CustomError {
  constructor() {
    super("Rate limit exceeded. Please try again later.", 429); // Too Many Requests
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = "Authentication required") {
    super(message, 401); // Unauthorized
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string, originalError?: string) {
    const fullMessage = originalError ? `${message}: ${originalError}` : message;
    super(fullMessage, 500); // Internal Server Error
  }
}

/**
 * Handles errors in a standardized way, logging them and returning a consistent JSON response.
 * @param error The error object.
 * @param requestInfo Optional information about the request for logging purposes.
 * @returns A NextResponse object with a standardized error format.
 */
export const errorHandler = {
  handleError: (
    error: Error | CustomError,
    requestId?: string
  ) => {
    const isCustomError = error instanceof CustomError;
    const statusCode =
      isCustomError && (error as CustomError).statusCode ? (error as CustomError).statusCode : 500;
    const message = error.message || "An unexpected error occurred.";

    logger.error(LogCategory.SYSTEM, "errorHandler caught an error", {
      errorDetails: {
        name: error.name,
        message,
        statusCode,
        stack: error.stack,
      },
      requestId,
    });

    metricsService.incrementMetric("errors.total");
    metricsService.incrementMetric(`errors.status.${statusCode}`);

    return {
      success: false,
      error: {
        message,
        type: error.name,
        code: statusCode.toString(),
        requestId
      },
      timestamp: new Date().toISOString()
    };
  }
};

// Fonction legacy pour compatibilité
export const legacyErrorHandler = (
  error: Error | CustomError,
  requestInfo: object = {}
) => {
  const isCustomError = error instanceof CustomError;
  const statusCode =
    isCustomError && (error as CustomError).statusCode ? (error as CustomError).statusCode : 500;
  const message = error.message || "An unexpected error occurred.";

  logger.error(LogCategory.SYSTEM, "errorHandler caught an error", {
    errorDetails: {
      name: error.name,
      message,
      statusCode,
      stack: error.stack,
    },
    requestInfo,
  });

  metricsService.incrementMetric("errors.total");
  metricsService.incrementMetric(`errors.status.${statusCode}`);

  return NextResponse.json(
    {
      error: {
        message,
        type: error.name,
      },
    },
    { status: statusCode }
  );
};