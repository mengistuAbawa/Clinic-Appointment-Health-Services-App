/** Central API router; kept in sync with the route mounts in app.ts. */
import { Router } from "express";
import authRoutes from "./auth.routes";
import clinicRoutes from "./clinics.routes";
import providerRoutes from "./providers.routes";
import appointmentRoutes from "./appointments.routes";
import favoriteRoutes from "./favorites.routes";
import userRoutes from "./users.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/clinics", clinicRoutes);
router.use("/providers", providerRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/users", userRoutes);

export default router;
