import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { ENV } from "../config/env";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ENV.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("generation:subscribe", ({ assignmentId }: { assignmentId: string }) => {
      socket.join(`assignment:${assignmentId}`);
    });

    socket.on("generation:unsubscribe", ({ assignmentId }: { assignmentId: string }) => {
      socket.leave(`assignment:${assignmentId}`);
    });
  });

  return io;
}