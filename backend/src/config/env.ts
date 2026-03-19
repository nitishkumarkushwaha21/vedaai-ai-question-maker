/*
 * Called by backend bootstrap and infra modules.
 * Calls dotenv to read process env once.
 * Provides centralized runtime config used by HTTP, Mongo, and Redis layers.
 */
import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT ?? 4000),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  MONGO_URI: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/veda_ai",
  REDIS_URL: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
} as const;