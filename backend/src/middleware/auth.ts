/**
 * src/middleware/auth.ts
 * JWT authentication middleware — verifies Bearer tokens and populates req.user.
 */

import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyAccessToken } from "../lib/jwt";
import { UnauthorizedError, ForbiddenError } from "../lib/errors";
import { prisma } from "../lib/prisma";

/**
 * Middleware that requires a valid access token in the Authorization header.
 * Populates req.user with the decoded token payload.
 */
export const authenticate: RequestHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid authorization header");
  }

  const token = header.slice(7);

  try {
    const payload = verifyAccessToken(token);
    void prisma.user.findFirst({ where: { id: payload.userId, deletedAt: null }, select: { id: true } }).then((user) => {
      if (!user) return next(new UnauthorizedError("Account is unavailable"));
      req.user = { userId: payload.userId, email: payload.email, role: payload.role };
      next();
    }).catch(next);
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }
};

/**
 * Factory that returns middleware restricting access to specific roles.
 */
export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("Insufficient permissions");
    }

    next();
  };
}
