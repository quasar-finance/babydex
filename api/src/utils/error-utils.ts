/**
 * Shared error handling utilities
 * Standardizes error responses and logging across the API
 */

import type { Context } from 'hono';

/**
 * Standard error response format for API endpoints
 */
export interface APIError {
  error: string;
  code?: string;
  details?: any;
}

/**
 * Create standardized JSON error response
 */
export function createErrorResponse(
  c: Context,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): Response {
  const errorResponse: APIError = {
    error: message,
    ...(code && { code }),
    ...(details && { details })
  };
  
  return c.json(errorResponse, statusCode as any);
}

/**
 * Log error and return standardized response
 * Combines console.error logging with JSON response
 */
export function handleError(
  c: Context,
  error: unknown,
  operation: string,
  statusCode: number = 500
): Response {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Error in ${operation}:`, error);
  
  return createErrorResponse(c, `Failed to ${operation}`, statusCode);
}

/**
 * Wrapper for async operations with standardized error handling
 */
export async function withErrorHandling<T>(
  c: Context,
  operation: string,
  fn: () => Promise<T>
): Promise<T | Response> {
  try {
    return await fn();
  } catch (error) {
    return handleError(c, error, operation);
  }
}

/**
 * Validate required parameters and return error if missing
 */
export function validateRequired(
  c: Context,
  params: Record<string, any>,
  requiredFields: string[]
): Response | null {
  const missing = requiredFields.filter(field => !params[field]);
  
  if (missing.length > 0) {
    return createErrorResponse(
      c,
      `Missing required parameters: ${missing.join(', ')}`,
      400,
      'MISSING_PARAMETERS'
    );
  }
  
  return null;
}