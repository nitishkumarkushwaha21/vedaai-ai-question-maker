import type { GenerationJob } from "./generation.types";

const jobById = new Map<string, GenerationJob>();

export function saveJob(job: GenerationJob) {
  jobById.set(job.jobId, job);
}

export function getJob(jobId: string) {
  return jobById.get(jobId) ?? null;
}

export function updateJob(jobId: string, patch: Partial<GenerationJob>) {
  const prev = jobById.get(jobId);
  if (!prev) return null;

  const next: GenerationJob = { ...prev, ...patch };
  jobById.set(jobId, next);
  return next;
}