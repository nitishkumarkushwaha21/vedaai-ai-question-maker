/*
 * Called by middleware, controllers, services, and workers.
 * Calls console with JSON payload for consistent structured logs.
 * This file centralizes info/error logging format across backend modules.
 */

type LogLevel = "info" | "error";

type LogPayload = {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  context?: Record<string, unknown>;
};

function writeLog(payload: LogPayload) {
  const line = JSON.stringify(payload);
  if (payload.level === "error") {
    console.error(line);
    return;
  }
  console.log(line);
}

export function logInfo(message: string, context?: Record<string, unknown>, requestId?: string) {
  writeLog({
    level: "info",
    message,
    timestamp: new Date().toISOString(),
    requestId,
    context,
  });
}

export function logError(message: string, context?: Record<string, unknown>, requestId?: string) {
  writeLog({
    level: "error",
    message,
    timestamp: new Date().toISOString(),
    requestId,
    context,
  });
}
