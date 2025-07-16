// lib/services/error-handler.service.ts
import { NextResponse } from "next/server";
import { logger, LogCategory } from "./logger.service";
import { metricsService } from "./metrics.service";

// Custom error for validation issues
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Custom error for external API failures
export class ExternalApiError extends Error {
  constructor(message: string = "An error occurred with an external service.") {
    super(message);
    this.name = "ExternalApiError";
  }
}

// Custom error for not-found resources
export class ResourceNotFoundError extends Error {
  constructor(message: string = "The requested resource was not found.") {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}

interface ErrorHandlerOptions {
  requestId?: string;
  userId?: string;
  path: string;
  method: string;
}

/**
 * Handles errors in a standardized way for API routes.
 * @param error The error object.
 * @param duration The duration of the request in ms.
 * @param options Additional context for error handling.
 * @returns A NextResponse object with the appropriate status code and error message.
 */
export function errorHandler(
  error: unknown,
  duration: number,
  options: ErrorHandlerOptions
) {
  const { requestId, path, method, userId } = options;
  let responseBody: { error: string; type: string; details?: string };
  let status: number;

  if (error instanceof ValidationError) {
    status = 400;
    responseBody = { error: error.message, type: 'validation_error' };
    logger.warn(LogCategory.API, 'API validation error', { error: error.message, duration, requestId, path });

  } else if (error instanceof ResourceNotFoundError) {
    status = 404;
    responseBody = { error: error.message, type: 'not_found_error' };
    logger.info(LogCategory.API, 'Resource not found', { error: error.message, duration, requestId, path });

  } else if (error instanceof ExternalApiError) {
    status = 502; // Bad Gateway
    responseBody = { error: 'An error occurred with an external service.', type: 'external_api_error' };
    logger.error(LogCategory.API, 'External API error', { error: error instanceof Error ? error.message : 'Unknown external error', duration, requestId, path });

  } else if (error instanceof Error && error.message.includes('Rate limit')) {
    status = 429;
    responseBody = { error: error.message, type: 'rate_limit_error' };
    logger.warn(LogCategory.API, 'API rate limit exceeded', { error: error.message, duration, requestId, path });

  } else {
    status = 500;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    responseBody = {
      error: "Internal Server Error.",
      type: 'internal_error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    };
    logger.error(LogCategory.API, 'API request failed', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      duration,
      requestId,
      path,
      userId,
    });
  }

  metricsService.recordAPIMetrics(path, method, status, duration);
  return NextResponse.json(responseBody, { status });
}