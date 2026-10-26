/**
 * src/validators/user.schema.ts
 * Zod schemas for user profile request validation.
 */

import { z } from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters").optional(),
    phone: z.string().trim().max(30, "Phone number must be at most 30 characters").optional(),
    // The app sends a cropped image as a data URL because the API contract has no media endpoint.
    avatarUrl: z.union([
      z.string().trim().url("Invalid avatar URL").max(2048).refine((value) => value.startsWith("https://"), "Avatar URL must use HTTPS"),
      z.string().regex(/^data:image\/(jpeg|png|webp|heic|heif);base64,[A-Za-z0-9+/]+={0,2}$/, "Avatar must be a JPEG, PNG, WebP, or HEIF image").max(900_000, "Avatar image is too large"),
    ]).optional(),
  }).strict().refine((body) => Object.keys(body).length > 0, "Provide at least one profile field to update"),
});
