/*
 * Entry file called by npm scripts (dev/start).
 * Calls Mongo connect, socket bootstrap, express app creation, and worker startup.
 * This file wires infrastructure dependencies before opening HTTP port.
 */
import { createServer } from "http";
import { createApp } from "./app";
import { ENV } from "./config/env";
import { connectMongo, disconnectMongo } from "./db/mongo";
import { startGenerationWorker } from "./queue/worker";
import { createSocketServer } from "./sockets/socket.server";
import { logError, logInfo } from "./utils/logger";

const bootstrap = async () => {
  await connectMongo();

  const temporaryApp = createServer();
  const io = createSocketServer(temporaryApp);

  const app = createApp(io);
  const httpServer = createServer(app);

  const worker = startGenerationWorker(io);

  io.attach(httpServer, {
    cors: {
      origin: ENV.CORS_ORIGIN,
      credentials: true,
    },
  });

  httpServer.listen(ENV.PORT, () => {
    logInfo("backend_server_started", { url: `http://localhost:${ENV.PORT}` });
  });

  let shuttingDown = false;

  const shutdown = async (signal: NodeJS.Signals) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logInfo("backend_shutdown_started", { signal });

    try {
      await worker.close();
      await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
      io.close();
      await disconnectMongo();
      logInfo("backend_shutdown_completed", { signal });
      process.exit(0);
    } catch (error) {
      logError("backend_shutdown_failed", {
        signal,
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
};

void bootstrap();