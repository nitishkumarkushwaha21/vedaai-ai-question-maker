/*
 * Called by generation controller after payload validation.
 * Calls in-memory store, Mongo model, socket emitter, and BullMQ enqueue helper.
 * This file creates the initial queued job and delegates processing to background worker.
 */
import type { Server } from "socket.io";
import { GenerationRecordModel } from "./generation.model";
import { enqueueGenerationJob } from "../../queue/queue";
import { saveJob, updateJob } from "./generation.store";
import type { GenerationJob, GenerationRequestPayload } from "./generation.types";
import { logError, logInfo } from "../../utils/logger";

function assignmentRoom(assignmentId: string) {
  return `assignment:${assignmentId}`;
}

function emitJob(io: Server, event: "generation:queued" | "generation:processing" | "generation:completed" | "generation:failed", job: GenerationJob) {
  io.to(assignmentRoom(job.assignmentId)).emit(event, {
    event,
    payload: { job },
  });
}

export function startGeneration(io: Server, request: GenerationRequestPayload) {
  const jobId = `job-${Date.now()}`;
  const startedAt = new Date().toISOString();

  const queuedJob: GenerationJob = {
    jobId,
    userId: request.userId,
    assignmentId: request.assignmentId,
    status: "queued",
    progress: 10,
    message: "Job queued",
    startedAt,
  };

  saveJob(queuedJob);
  emitJob(io, "generation:queued", queuedJob);
  logInfo("generation_job_queued", { jobId, assignmentId: request.assignmentId });

  // Persist queued job snapshot without blocking API response.
  void GenerationRecordModel.findOneAndUpdate(
    { jobId },
    {
      jobId,
      userId: request.userId,
      assignmentId: request.assignmentId,
      status: queuedJob.status,
      progress: queuedJob.progress,
      message: queuedJob.message,
      startedAt: queuedJob.startedAt,
      request,
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  ).catch((error: unknown) => {
    logError("generation_persist_queued_failed", { jobId, error: error instanceof Error ? error.message : String(error) });
  });

  // Queue processing is done by BullMQ worker; API thread only enqueues.
  void enqueueGenerationJob({ jobId, request }).catch((error: unknown) => {
    const failed = updateJob(jobId, {
      status: "failed",
      message: "Failed to enqueue generation job",
      error: error instanceof Error ? error.message : "Unknown queue error",
    });

    void GenerationRecordModel.findOneAndUpdate(
      { jobId },
      {
        status: "failed",
        message: failed?.message ?? "Failed to enqueue generation job",
        error: failed?.error,
      },
      { returnDocument: "after" },
    ).catch((persistError: unknown) => {
      logError(
        "generation_persist_enqueue_failure_failed",
        { jobId, error: persistError instanceof Error ? persistError.message : String(persistError) },
      );
    });

    if (failed) {
      emitJob(io, "generation:failed", failed);
      logError("generation_enqueue_failed", { jobId, assignmentId: request.assignmentId, error: failed.error });
    }
  });

  return queuedJob;
}