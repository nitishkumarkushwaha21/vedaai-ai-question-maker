/*
 * Called by queue and worker bootstrap modules.
 * Parses Redis URL into BullMQ-compatible connection options.
 * This file centralizes Redis options and health ping checks.
 */
import IORedis from "ioredis";
import { ENV } from "../config/env";

export function createRedisConnection() {
  const parsed = new URL(ENV.REDIS_URL);
  const host = parsed.hostname;
  const isUpstashHost = host.includes("upstash");
  const shouldUseTls = parsed.protocol === "rediss:" || isUpstashHost;
  const dbFromPath = parsed.pathname && parsed.pathname !== "/" ? Number(parsed.pathname.slice(1)) : undefined;

  return {
    host,
    port: Number(parsed.port || 6379),
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    db: Number.isFinite(dbFromPath) ? dbFromPath : undefined,
    maxRetriesPerRequest: null,
    tls: shouldUseTls ? {} : undefined,
  };
}

export async function checkRedisHealth() {
  const client = new IORedis(createRedisConnection());

  const startedAt = Date.now();

  try {
    const pong = await client.ping();
    return {
      ok: pong === "PONG",
      latencyMs: Date.now() - startedAt,
      state: client.status,
    };
  } catch (error) {
    return {
      ok: false,
      latencyMs: Date.now() - startedAt,
      state: client.status,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await client.quit().catch(() => {
      // Ignore quit errors for short-lived diagnostics client.
    });
  }
}
