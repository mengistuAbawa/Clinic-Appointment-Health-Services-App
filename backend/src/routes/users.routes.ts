/** Authenticated profile read, update, and soft-delete routes. */
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateUserSchema } from "../validators/user.schema";
import * as controller from "../controllers/account.controller";
const router = Router();
router.use(authenticate);
router.get("/me", asyncHandler(controller.getMe));
router.put("/me", validate(updateUserSchema), asyncHandler(controller.updateMe));
router.delete("/me", asyncHandler(controller.deleteMe));
export default router;
