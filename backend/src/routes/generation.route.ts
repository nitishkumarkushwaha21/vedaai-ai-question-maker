/*
 * Called by app.ts to mount generation HTTP routes.
 * Calls generation controller factory with socket dependency.
 * This file maps API paths to controller handlers for start/status/result/regenerate.
 */
import { Router } from "express";
import type { Server } from "socket.io";
import { createGenerationController } from "../modules/generation/generation.controller";

export function createGenerationRouter(io: Server) {
  const router = Router();
  const controller = createGenerationController(io);

  router.post("/start", controller.start);
  router.post("/:jobId/regenerate", controller.regenerate);
  router.get("/:jobId", controller.getById);

  router.get("/:jobId/result", controller.getResult);

  return router;
}