/*
 * Called by backend bootstrap after socket server is initialized.
 * Calls BullMQ Worker to process queued generation jobs and emit socket events.
 * This file moves lifecycle simulation out of API thread into worker execution.
 */
import { Worker } from "bullmq";
import type { Server } from "socket.io";
import { createRedisConnection } from "../db/redis";
import { GenerationRecordModel } from "../modules/generation/generation.model";
import { buildMockPaper } from "../modules/generation/mock-paper";
import { updateJob } from "../modules/generation/generation.store";
import type { GenerationJob } from "../modules/generation/generation.types";
import { logError, logInfo } from "../utils/logger";
import { GENERATION_QUEUE_NAME } from "./queue";
import type { GenerationJobName, GenerationQueueJobData } from "./jobs/generation.job";

const workerRuntime = {
  startedAt: null as string | null,
  lastCompletedAt: null as string | null,
  lastFailedAt: null as string | null,
  lastError: null as string | null,
  active: false,
  metrics: {
    startedJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
  },
};

function assignmentRoom(assignmentId: string) {
  return `assignment:${assignmentId}`;
}

function emitJob(
  io: Server,
  event: "generation:queued" | "generation:processing" | "generation:completed" | "generation:failed",
  job: GenerationJob,
) {
  io.to(assignmentRoom(job.assignmentId)).emit(event, {
    event,
    payload: { job },
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function startGenerationWorker(io: Server) {
  const workerConnection = createRedisConnection();

  const worker = new Worker<GenerationQueueJobData, void, GenerationJobName>(
    GENERATION_QUEUE_NAME,
    async (queueJob) => {
      const { jobId, request } = queueJob.data;
      workerRuntime.metrics.startedJobs += 1;
      logInfo("generation_worker_started", {
        jobId,
        assignmentId: request.assignmentId,
        attemptsMade: queueJob.attemptsMade,
      });

      const processing = updateJob(jobId, {
        status: "processing",
        progress: 60,
        message: "Generating sections and questions...",
      });

      if (processing) {
        await GenerationRecordModel.findOneAndUpdate(
          { jobId },
          {
            status: processing.status,
            progress: processing.progress,
            message: processing.message,
          },
          { returnDocument: "after" },
        );
        emitJob(io, "generation:processing", processing);
        logInfo("generation_worker_processing", { jobId, assignmentId: request.assignmentId, progress: processing.progress });
      }

      await wait(1500);

      const generatedPaper = await buildMockPaper(request);

      const completed = updateJob(jobId, {
        status: "completed",
        progress: 100,
        message: "Question paper generated successfully",
        completedAt: new Date().toISOString(),
      });

      if (completed) {
        await GenerationRecordModel.findOneAndUpdate(
          { jobId },
          {
            status: completed.status,
            progress: completed.progress,
            message: completed.message,
            completedAt: completed.completedAt,
            generatedPaper,
          },
          { returnDocument: "after" },
        );
        emitJob(io, "generation:completed", completed);
        workerRuntime.lastCompletedAt = new Date().toISOString();
        workerRuntime.metrics.completedJobs += 1;
        logInfo("generation_worker_completed", { jobId, assignmentId: request.assignmentId, completedAt: completed.completedAt });
      }
    },
    {
      connection: workerConnection,
      concurrency: 1,
    },
  );

  workerRuntime.startedAt = new Date().toISOString();
  workerRuntime.active = true;

  worker.on("failed", async (queueJob, error) => {
    if (!queueJob) {
      return;
    }

    const { jobId, request } = queueJob.data;
    const failed = updateJob(jobId, {
      status: "failed",
      message: error.message,
      error: error.message,
    });

    await GenerationRecordModel.findOneAndUpdate(
      { jobId },
      {
        status: "failed",
        message: error.message,
        error: error.message,
      },
      { returnDocument: "after" },
    );

    if (failed) {
      emitJob(io, "generation:failed", failed);
      workerRuntime.lastFailedAt = new Date().toISOString();
      workerRuntime.lastError = error.message;
      workerRuntime.metrics.failedJobs += 1;
      logError("generation_worker_failed", {
        jobId,
        assignmentId: request.assignmentId,
        attemptsMade: queueJob.attemptsMade,
        error: error.message,
      });
    } else {
      emitJob(io, "generation:failed", {
        jobId,
        assignmentId: request.assignmentId,
        status: "failed",
        progress: 0,
        message: error.message,
        startedAt: new Date().toISOString(),
        error: error.message,
      });
      workerRuntime.lastFailedAt = new Date().toISOString();
      workerRuntime.lastError = error.message;
      workerRuntime.metrics.failedJobs += 1;
      logError("generation_worker_failed_without_cached_state", {
        jobId,
        assignmentId: request.assignmentId,
        attemptsMade: queueJob.attemptsMade,
        error: error.message,
      });
    }
  });

  worker.on("closed", () => {
    workerRuntime.active = false;
  });

  return worker;
}

export function getWorkerHealthSnapshot() {
  return {
    ok: workerRuntime.active,
    startedAt: workerRuntime.startedAt,
    lastCompletedAt: workerRuntime.lastCompletedAt,
    lastFailedAt: workerRuntime.lastFailedAt,
    lastError: workerRuntime.lastError,
    metrics: workerRuntime.metrics,
  };
}
