/**
 * src/validators/clinic.schema.ts
 * Zod schemas for clinic request validation.
 */

import { z } from "zod";

export const listClinicsSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    category: z.string().trim().max(80).optional(),
    page: z.string().regex(/^[1-9]\d*$/).max(8).optional(),
    limit: z.string().regex(/^[1-9]\d*$/).max(3).optional(),
    sort: z.enum(["distance", "name", "createdAt"]).optional(),
    lat: z.string().refine((value) => Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 90, "Invalid latitude").optional(),
    lng: z.string().refine((value) => Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 180, "Invalid longitude").optional(),
  }).strict(),
}).refine((value) => value.query.sort !== "distance" || Boolean(value.query.lat && value.query.lng), { path: ["query", "lat"], message: "lat and lng are required when sort=distance" });

export const clinicIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Clinic ID is required").max(100),
  }).strict(),
});
