/*
 * Called by controllers and health handlers to send standardized API payloads.
 * Calls express response methods with a single success/error envelope shape.
 * This file ensures contract consistency across all backend HTTP endpoints.
 */
import type { Response } from "express";

export type ApiSuccessEnvelope<TData> = {
  ok: true;
  data: TData;
  meta?: Record<string, unknown>;
};

export type ApiErrorEnvelope = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
};

export function sendSuccess<TData>(
  res: Response,
  status: number,
  data: TData,
  meta?: Record<string, unknown>,
) {
  const payload: ApiSuccessEnvelope<TData> = {
    ok: true,
    data,
    ...(meta ? { meta } : {}),
  };

  return res.status(status).json(payload);
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  const requestId = typeof res.locals.requestId === "string" ? res.locals.requestId : undefined;

  const payload: ApiErrorEnvelope = {
    ok: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
      ...(requestId ? { requestId } : {}),
    },
  };

  return res.status(status).json(payload);
}
