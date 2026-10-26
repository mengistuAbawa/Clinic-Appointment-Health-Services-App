/** Starts the HTTP API after environment configuration has been validated. */
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { logger } from "./utils/logger";

const server = app.listen(env.PORT, () => logger.info(`API listening on port ${env.PORT}`));
const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received; closing API`);
  server.close(async () => { await prisma.$disconnect(); process.exit(0); });
};
process.on("SIGINT", () => { void shutdown("SIGINT"); });
process.on("SIGTERM", () => { void shutdown("SIGTERM"); });
