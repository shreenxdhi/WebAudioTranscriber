import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/errors';

/**
 * Middleware to handle 404 Not Found errors.
 * This should be the last route defined in your Express application.
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new HttpError(
    `🔍 Not Found - ${req.method} ${req.originalUrl}`,
    404,
    'NOT_FOUND'
  );
  next(error);
};
