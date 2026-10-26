/**
 * src/validators/appointment.schema.ts
 * Zod schemas for appointment request validation.
 */

import { z } from "zod";

export const createAppointmentSchema = z.object({
  body: z.object({
    slotId: z.string({ required_error: "Slot ID is required" }).min(1),
    notes: z.string().trim().max(500, "Notes must be at most 500 characters").optional(),
  }).strict(),
});

export const listAppointmentsSchema = z.object({
  query: z.object({
    status: z.enum(["upcoming", "past"]).optional(),
    page: z.string().regex(/^[1-9]\d*$/).max(8).optional(),
    limit: z.string().regex(/^[1-9]\d*$/).max(3).optional(),
  }).strict(),
});

export const appointmentIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Appointment ID is required"),
  }),
});
