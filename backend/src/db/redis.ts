/*
 * Called by queue and worker bootstrap modules.
 * Parses Redis URL into BullMQ-compatible connection options.
 * This file centralizes Redis options and health ping checks.
 */
import IORedis from "ioredis";
import { ENV } from "../config/env";

export function createRedisConnection() {
  const parsed = new URL(ENV.REDIS_URL);

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    maxRetriesPerRequest: null,
  };
}

export async function checkRedisHealth() {
  const client = new IORedis(ENV.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

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
