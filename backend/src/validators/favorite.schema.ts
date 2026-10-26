/**
 * src/validators/favorite.schema.ts
 * Zod schemas for favorite request validation.
 */

import { z } from "zod";

export const favoriteClinicParamSchema = z.object({
  params: z.object({
    clinicId: z.string().min(1, "Clinic ID is required").max(100),
  }).strict(),
});
