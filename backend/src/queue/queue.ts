/*
 * Called by generation service to enqueue work.
 * Calls BullMQ Queue with Redis connection.
 * This file owns queue retry/backoff policy and enqueue helper.
 */
import { Queue } from "bullmq";
import { createRedisConnection } from "../db/redis";
import { logInfo } from "../utils/logger";
import type { GenerationJobName, GenerationQueueJobData } from "./jobs/generation.job";

export const GENERATION_QUEUE_NAME = "generation-queue";

const queueConnection = createRedisConnection();

const generationQueue = new Queue<GenerationQueueJobData, void, GenerationJobName>(GENERATION_QUEUE_NAME, {
  connection: queueConnection,
});

export async function enqueueGenerationJob(data: GenerationQueueJobData) {
  await generationQueue.add("generation-process", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  });

  logInfo("generation_job_enqueued", {
    jobId: data.jobId,
    assignmentId: data.request.assignmentId,
    attempts: 3,
    backoff: "exponential",
  });
}
