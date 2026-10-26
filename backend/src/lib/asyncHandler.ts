/**
 * src/lib/asyncHandler.ts
 * Wraps async Express route handlers to automatically catch and forward errors.
 */

import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler so rejected promises are forwarded to the
 * Express error-handling middleware via next(err).
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
