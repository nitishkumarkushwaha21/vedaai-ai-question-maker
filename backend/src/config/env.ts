/*
 * Called by backend bootstrap and infra modules.
 * Calls dotenv to read process env once.
 * Provides centralized runtime config used by HTTP, Mongo, and Redis layers.
 */
import dotenv from "dotenv";

dotenv.config();

function parseCorsOrigins(value: string | undefined) {
  const defaults = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.56.1:3000",
    "https://vedaai-ai-question-maker.vercel.app",
  ];
  const configured = (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return Array.from(new Set([...defaults, ...configured]));
}

export const ENV = {
  PORT: Number(process.env.PORT ?? 4000),
  CORS_ORIGINS: parseCorsOrigins(process.env.CORS_ORIGIN),
  MONGO_URI: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/veda_ai",
  REDIS_URL: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ?? "",
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
} as const;