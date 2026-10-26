/**
 * src/middleware/errorHandler.ts
 * Global Express error-handling middleware.
 */

import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors";
import { logger } from "../utils/logger";
import { Prisma } from "@prisma/client";

/**
 * Catches all errors thrown or forwarded via next(err) and returns a
 * standardised JSON error response.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Known application error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ message: "A record with these details already exists", code: "CONFLICT" });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ message: "The requested record was not found", code: "NOT_FOUND" });
      return;
    }
    if (err.code === "P2003" || err.code === "P2014") {
      res.status(400).json({ message: "The request references an invalid related record", code: "INVALID_RELATION" });
      return;
    }
  }

  const requestError = err as Error & { status?: number; statusCode?: number; type?: string };
  const status = requestError.status ?? requestError.statusCode;
  if (status === 400 || requestError.type === "entity.parse.failed") {
    res.status(400).json({ message: "Request body contains invalid JSON", code: "INVALID_JSON" });
    return;
  }
  if (status === 413 || requestError.type === "entity.too.large") {
    res.status(413).json({ message: "Request body is too large", code: "PAYLOAD_TOO_LARGE" });
    return;
  }

  // Unexpected error — log and return generic 500
  logger.error("Unhandled error:", err);

  res.status(500).json({
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
