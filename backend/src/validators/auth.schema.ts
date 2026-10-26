/**
 * src/validators/auth.schema.ts
 * Zod schemas for authentication request validation.
 */

import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).trim().email("Invalid email address").max(254),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    name: z.string({ required_error: "Name is required" }).trim().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
    phone: z.string().trim().max(30, "Phone number must be at most 30 characters").optional(),
  }).strict(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).trim().email("Invalid email address").max(254),
    password: z.string({ required_error: "Password is required" }).min(1).max(128),
  }).strict(),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }).min(1).max(4096),
  }).strict(),
});
