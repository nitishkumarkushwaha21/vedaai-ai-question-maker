/*
 * Called by generation service when creating a background job.
 * Used by queue and worker modules as the job payload contract.
 * This file defines what data is serialized into BullMQ jobs.
 */
import type { GenerationRequestPayload } from "../../modules/generation/generation.types";

export type GenerationJobName = "generation-process";

export type GenerationQueueJobData = {
  jobId: string;
  request: GenerationRequestPayload;
};
