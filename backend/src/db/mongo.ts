/*
 * Called by backend bootstrap and diagnostics handlers.
 * Calls mongoose connect/disconnect and exposes connection readiness snapshot.
 * This file centralizes MongoDB lifecycle operations for runtime safety.
 */
import mongoose from "mongoose";
import { ENV } from "../config/env";

export async function connectMongo() {
  await mongoose.connect(ENV.MONGO_URI);
  console.log("Mongo connected");
}

export async function disconnectMongo() {
  await mongoose.disconnect();
}

export function getMongoHealthSnapshot() {
  const readyStateMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const readyState = mongoose.connection.readyState;
  return {
    ok: readyState === 1,
    state: readyStateMap[readyState] ?? "unknown",
  };
}