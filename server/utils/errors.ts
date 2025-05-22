/**
 * Custom HttpError class for handling HTTP errors in a structured way
 */
export class HttpError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    
    // Set the prototype explicitly (needed when extending built-in classes)
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  // Common HTTP errors as static methods for convenience
  static badRequest(message: string = 'Bad Request', code: string = 'BAD_REQUEST'): HttpError {
    return new HttpError(message, 400, code);
  }

  static unauthorized(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED'): HttpError {
    return new HttpError(message, 401, code);
  }

  static forbidden(message: string = 'Forbidden', code: string = 'FORBIDDEN'): HttpError {
    return new HttpError(message, 403, code);
  }

  static notFound(message: string = 'Not Found', code: string = 'NOT_FOUND'): HttpError {
    return new HttpError(message, 404, code);
  }

  static conflict(message: string = 'Conflict', code: string = 'CONFLICT'): HttpError {
    return new HttpError(message, 409, code);
  }

  static validationError(message: string = 'Validation Error', code: string = 'VALIDATION_ERROR'): HttpError {
    return new HttpError(message, 422, code);
  }

  static tooManyRequests(message: string = 'Too Many Requests', code: string = 'TOO_MANY_REQUESTS'): HttpError {
    return new HttpError(message, 429, code);
  }

  static internalServerError(message: string = 'Internal Server Error', code: string = 'INTERNAL_SERVER_ERROR'): HttpError {
    return new HttpError(message, 500, code);
  }

  static notImplemented(message: string = 'Not Implemented', code: string = 'NOT_IMPLEMENTED'): HttpError {
    return new HttpError(message, 501, code);
  }

  static serviceUnavailable(message: string = 'Service Unavailable', code: string = 'SERVICE_UNAVAILABLE'): HttpError {
    return new HttpError(message, 503, code);
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends HttpError {
  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'API_ERROR',
    public details?: unknown
  ) {
    super(message, statusCode, code);
    this.name = 'ApiError';
    this.details = details;
    
    // Set the prototype explicitly (needed when extending built-in classes)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends HttpError {
  constructor(
    message: string = 'Validation Error',
    public errors: Record<string, string[]> = {},
    code: string = 'VALIDATION_ERROR'
  ) {
    super(message, 422, code);
    this.name = 'ValidationError';
    this.errors = errors;
    
    // Set the prototype explicitly (needed when extending built-in classes)
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Custom error class for authentication errors
 */
export class AuthenticationError extends HttpError {
  constructor(message: string = 'Authentication Failed', code: string = 'AUTHENTICATION_ERROR') {
    super(message, 401, code);
    this.name = 'AuthenticationError';
    
    // Set the prototype explicitly (needed when extending built-in classes)
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Custom error class for authorization errors
 */
export class AuthorizationError extends HttpError {
  constructor(message: string = 'Forbidden', code: string = 'AUTHORIZATION_ERROR') {
    super(message, 403, code);
    this.name = 'AuthorizationError';
    
    // Set the prototype explicitly (needed when extending built-in classes)
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Custom error class for rate limiting errors
 */
export class RateLimitError extends HttpError {
  constructor(
    message: string = 'Too Many Requests',
    public retryAfter: number = 60,
    code: string = 'RATE_LIMIT_EXCEEDED'
  ) {
    super(message, 429, code);
    this.name = 'RateLimitError';
    
    // Set the prototype explicitly (needed when extending built-in classes)
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}
