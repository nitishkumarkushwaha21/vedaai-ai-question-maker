/*
 * Called by index bootstrap to create express app instance.
 * Calls request tracing middleware and generation route module.
 * This file applies global middleware and mounts backend HTTP routes.
 */
import express from "express";
import cors from "cors";
import type { Server } from "socket.io";
import { ENV } from "./config/env";
import { getMongoHealthSnapshot } from "./db/mongo";
import { checkRedisHealth } from "./db/redis";
import { getWorkerHealthSnapshot } from "./queue/worker";
import { createGenerationRouter } from "./routes/generation.route";
import { notFoundHandler, errorHandler } from "./utils/errors";
import { requestTraceMiddleware } from "./utils/request-trace";
import { sendSuccess } from "./utils/response";

export function createApp(io: Server) {
  const app = express();

  app.use(
    cors({
      origin: ENV.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(requestTraceMiddleware);

  app.get("/api/health", (_req, res) => {
    return sendSuccess(res, 200, { service: "veda-backend" });
  });

  app.get("/api/health/diagnostics", async (_req, res) => {
    const mongo = getMongoHealthSnapshot();
    const redis = await checkRedisHealth();
    const worker = getWorkerHealthSnapshot();
    const ok = mongo.ok && redis.ok && worker.ok;

    return sendSuccess(
      res,
      ok ? 200 : 503,
      {
        service: "veda-backend",
        uptimeSeconds: Math.round(process.uptime()),
        checks: {
          mongo,
          redis,
          worker,
        },
      },
      { diagnostic: true },
    );
  });

  app.use("/api/generation", createGenerationRouter(io));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}