/**
 * src/validators/provider.schema.ts
 * Zod schemas for provider request validation.
 */

import { z } from "zod";

export const providerIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Provider ID is required").max(100),
  }).strict(),
});

export const providerSlotsSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Provider ID is required").max(100),
  }),
  query: z.object({
    date: z
      .string({ required_error: "Date is required (YYYY-MM-DD)" })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  }).strict(),
});
