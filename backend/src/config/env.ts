/**
 * src/config/env.ts
 * Validates and exports all environment variables using Zod.
 */

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().url().refine((value) => value.startsWith("postgresql://") || value.startsWith("postgres://"), "DATABASE_URL must be a PostgreSQL connection URL"),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().regex(/^[1-9]\d*(s|m|h|d)$/, "Use a duration such as 15m or 7d").default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().regex(/^[1-9]\d*(s|m|h|d)$/, "Use a duration such as 15m or 7d").default("7d"),
  CORS_ORIGINS: z.string().default("http://localhost:8081,http://localhost:19006"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1_000).default(900_000), // 15 min
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(100),
}).refine((value) => value.JWT_ACCESS_SECRET !== value.JWT_REFRESH_SECRET, {
  path: ["JWT_REFRESH_SECRET"],
  message: "Access and refresh secrets must be different",
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

/** Validated environment configuration */
export const env = parsed.data;
