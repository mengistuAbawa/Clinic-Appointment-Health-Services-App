/**
 * src/middleware/notFound.ts
 * Catches requests to undefined routes and returns a 404 response.
 */

import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../lib/errors";

/**
 * Middleware that fires for any route not matched by the router.
 */
export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}
