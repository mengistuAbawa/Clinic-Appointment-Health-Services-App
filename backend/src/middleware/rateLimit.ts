/**
 * src/middleware/rateLimit.ts
 * Rate-limiting middleware using express-rate-limit.
 */

import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/**
 * Global rate limiter applied to all API routes.
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later",
    code: "TOO_MANY_REQUESTS",
  },
});

/**
 * Stricter rate limiter for authentication endpoints (login / register).
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts, please try again later",
    code: "TOO_MANY_REQUESTS",
  },
});
