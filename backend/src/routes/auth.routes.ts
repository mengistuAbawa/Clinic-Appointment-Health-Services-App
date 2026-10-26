/** Routes for registration, login, token refresh, and logout. */
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimit";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, refreshSchema } from "../validators/auth.schema";
import * as controller from "../controllers/auth.controller";
const router = Router();
router.post("/register", authLimiter, validate(registerSchema), asyncHandler(controller.register));
router.post("/login", authLimiter, validate(loginSchema), asyncHandler(controller.login));
router.post("/refresh", validate(refreshSchema), asyncHandler(controller.refresh));
router.post("/logout", authenticate, asyncHandler(controller.logout));
export default router;
