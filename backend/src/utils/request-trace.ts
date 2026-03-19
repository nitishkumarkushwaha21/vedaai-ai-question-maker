/*
 * Called by app.ts as global express middleware.
 * Calls crypto for request IDs and logger for request summary logs.
 * This file attaches requestId to each request and emits completion logs.
 */
import { randomUUID } from "crypto";
import type { NextFunction, Request, Response } from "express";
import { logInfo } from "./logger";

export function requestTraceMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = req.header("x-request-id") ?? randomUUID();
  const startedAt = Date.now();

  res.locals.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    logInfo(
      "http_request_completed",
      {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
      },
      requestId,
    );
  });

  next();
}
