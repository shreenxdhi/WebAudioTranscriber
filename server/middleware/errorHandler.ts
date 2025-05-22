import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { HttpError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Error handling middleware for Express applications.
 * Handles different types of errors including Zod validation errors and custom HttpErrors.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Log the error for debugging
  logger.error('Error:', err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const validationError = fromZodError(err);
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation Error',
        details: validationError.details,
      },
    });
  }

  // Handle custom HttpErrors
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    });
  }

  // Handle other types of errors
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        error: err 
      }),
    },
  });
};
