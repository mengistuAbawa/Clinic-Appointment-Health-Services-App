/** Authenticated appointment creation, history, detail, and cancellation routes. */
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createAppointmentSchema, listAppointmentsSchema, appointmentIdParamSchema } from "../validators/appointment.schema";
import * as controller from "../controllers/appointments.controller";
const router = Router();
router.use(authenticate);
router.post("/", validate(createAppointmentSchema), asyncHandler(controller.createAppointment));
router.get("/", validate(listAppointmentsSchema), asyncHandler(controller.listAppointments));
router.patch("/:id/cancel", validate(appointmentIdParamSchema), asyncHandler(controller.cancelAppointment));
router.get("/:id", validate(appointmentIdParamSchema), asyncHandler(controller.getAppointment));
export default router;
