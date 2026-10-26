/** Authenticated clinic favorites routes. */
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { favoriteClinicParamSchema } from "../validators/favorite.schema";
import * as controller from "../controllers/account.controller";
const router = Router();
router.use(authenticate);
router.get("/", asyncHandler(controller.listFavorites));
router.post("/:clinicId", validate(favoriteClinicParamSchema), asyncHandler(controller.addFavorite));
router.delete("/:clinicId", validate(favoriteClinicParamSchema), asyncHandler(controller.removeFavorite));
export default router;
