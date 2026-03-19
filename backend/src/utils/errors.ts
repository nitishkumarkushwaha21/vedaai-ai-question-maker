/*
 * Called by app.ts as fallback middleware and by controllers when throwing domain errors.
 * Calls logger to emit structured exception details.
 * This file normalizes unhandled errors into the shared API error envelope.
 */
import type { NextFunction, Request, Response } from "express";
import { logError } from "./logger";
import { sendError } from "./response";

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  return sendError(res, 404, "ROUTE_NOT_FOUND", "Route not found");
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const requestId = typeof res.locals.requestId === "string" ? res.locals.requestId : undefined;

  if (error instanceof AppError) {
    logError("app_error", { code: error.code, details: error.details }, requestId);
    return sendError(res, error.statusCode, error.code, error.message, error.details);
  }

  const message = error instanceof Error ? error.message : "Unknown server error";
  logError("unhandled_error", { message }, requestId);
  return sendError(res, 500, "INTERNAL_SERVER_ERROR", "Internal server error");
}
