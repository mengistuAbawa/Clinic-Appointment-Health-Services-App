/** Routes for browsing clinics and their provider summaries. */
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { validate } from "../middleware/validate";
import { listClinicsSchema, clinicIdParamSchema } from "../validators/clinic.schema";
import * as controller from "../controllers/catalog.controller";
const router = Router();
router.get("/", validate(listClinicsSchema), asyncHandler(controller.listClinics));
router.get("/:id", validate(clinicIdParamSchema), asyncHandler(controller.getClinic));
export default router;
