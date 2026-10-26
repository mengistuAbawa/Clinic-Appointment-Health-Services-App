/** Express application composition: security middleware, routes, and errors. */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { ForbiddenError } from "./lib/errors";
import { swaggerSpec } from "./config/swagger";
import { apiLimiter } from "./middleware/rateLimit";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes";

const app = express();
const allowedOrigins = env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);
app.disable("x-powered-by");
app.set("trust proxy", env.NODE_ENV === "production" ? 1 : false);
app.use(helmet());
app.use((req, res, next) => {
  if (env.NODE_ENV === "production" && !req.secure) {
    res.status(400).json({ message: "HTTPS is required", code: "HTTPS_REQUIRED" });
    return;
  }
  next();
});
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new ForbiddenError("Origin is not allowed by CORS"));
} }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", apiLimiter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
