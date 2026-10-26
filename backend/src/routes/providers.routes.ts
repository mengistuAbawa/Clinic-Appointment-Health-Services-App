/** Routes for provider profiles and date-specific appointment availability. */
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { validate } from "../middleware/validate";
import { providerIdParamSchema, providerSlotsSchema } from "../validators/provider.schema";
import * as controller from "../controllers/catalog.controller";
const router = Router();
router.get("/:id/slots", validate(providerSlotsSchema), asyncHandler(controller.getProviderSlots));
router.get("/:id", validate(providerIdParamSchema), asyncHandler(controller.getProvider));
export default router;
