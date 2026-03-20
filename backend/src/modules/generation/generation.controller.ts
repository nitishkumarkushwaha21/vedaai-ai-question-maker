/*
 * Called by generation routes to handle HTTP requests.
 * Calls schema validator, in-memory store, Mongo model, and generation service.
 * This file translates API requests into generation start/status/result/regenerate flows.
 */
import type { Request, Response } from "express";
import type { Server } from "socket.io";
import { GenerationRecordModel } from "./generation.model";
import { extractTextFromUploadedFile } from "./file-extractor";
import { generationRequestSchema } from "./generation.schema";
import { getJob } from "./generation.store";
import { startGeneration } from "./generation.service";
import type { GenerationRequestPayload } from "./generation.types";
import { logError, logInfo } from "../../utils/logger";
import { sendError, sendSuccess } from "../../utils/response";

function parseStartRequestBody(body: unknown): unknown {
  if (!body || typeof body !== "object") {
    return body;
  }

  const candidate = body as Record<string, unknown>;
  if (typeof candidate.request !== "string") {
    return body;
  }

  try {
    return JSON.parse(candidate.request);
  } catch {
    return body;
  }
}

export function createGenerationController(io: Server) {
  const start = async (req: Request, res: Response) => {
    const requestId = String(res.locals.requestId ?? "n/a");
    const authUserId = String(res.locals.authUserId ?? "demo-user-001");
    const parsedBody = parseStartRequestBody(req.body);
    const bodyWithUser =
      parsedBody && typeof parsedBody === "object"
        ? { ...(parsedBody as Record<string, unknown>), userId: authUserId }
        : parsedBody;
    const parsed = generationRequestSchema.safeParse(bodyWithUser);

    if (!parsed.success) {
      logError("generation_start_validation_failed", { issueCount: parsed.error.issues.length }, requestId);
      return sendError(res, 400, "INVALID_GENERATION_REQUEST", "Invalid generation request payload", parsed.error.issues);
    }

    let requestPayload: GenerationRequestPayload = {
      ...parsed.data,
      userId: authUserId,
      sourceFileAttached: parsed.data.sourceFileAttached || Boolean(req.file),
    };

    if (req.file) {
      try {
        const sourceMaterialText = await extractTextFromUploadedFile(req.file);
        requestPayload = {
          ...requestPayload,
          sourceFileAttached: true,
          sourceFileName: req.file.originalname,
          sourceMaterialText,
        };
      } catch (error) {
        logError(
          "generation_source_file_extraction_failed",
          { error: error instanceof Error ? error.message : String(error) },
          requestId,
        );
        return sendError(res, 400, "FILE_PROCESSING_FAILED", error instanceof Error ? error.message : "Failed to process source file");
      }
    }

    const job = startGeneration(io, requestPayload);
    logInfo("generation_start_accepted", { jobId: job.jobId, assignmentId: job.assignmentId }, requestId);

    return sendSuccess(res, 202, { job });
  };

  const getById = (req: Request, res: Response) => {
    const requestId = String(res.locals.requestId ?? "n/a");
    const authUserId = String(res.locals.authUserId ?? "demo-user-001");
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    if (!jobId) {
      logError("generation_get_invalid_job_id", undefined, requestId);
      return sendError(res, 400, "INVALID_JOB_ID", "Invalid job id");
    }

    const job = getJob(jobId);
    if (!job) {
      logError("generation_get_not_found", { jobId }, requestId);
      return sendError(res, 404, "JOB_NOT_FOUND", "Job not found");
    }

    if (job.userId !== authUserId) {
      logError("generation_get_forbidden", { jobId, authUserId }, requestId);
      return sendError(res, 403, "FORBIDDEN", "You are not allowed to access this job");
    }
    logInfo("generation_get_success", { jobId, status: job.status }, requestId);
    return sendSuccess(res, 200, { job });
  };

  const getResult = async (req: Request, res: Response) => {
    const requestId = String(res.locals.requestId ?? "n/a");
    const authUserId = String(res.locals.authUserId ?? "demo-user-001");
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    if (!jobId) {
      logError("generation_result_invalid_job_id", undefined, requestId);
      return sendError(res, 400, "INVALID_JOB_ID", "Invalid job id");
    }

    const record = await GenerationRecordModel.findOne({ jobId, userId: authUserId }).lean();
    if (!record) {
      logError("generation_result_not_found", { jobId }, requestId);
      return sendError(res, 404, "JOB_NOT_FOUND", "Job not found");
    }

    if (record.status === "failed") {
      logError("generation_result_failed", { jobId, error: record.error ?? record.message }, requestId);
      return sendSuccess(res, 200, {
        status: "failed",
        job: {
          jobId: record.jobId,
          assignmentId: record.assignmentId,
          status: record.status,
          progress: record.progress,
          message: record.message,
          startedAt: record.startedAt,
          completedAt: record.completedAt,
          error: record.error,
        },
      }, { message: record.error ?? record.message ?? "Generation failed" });
    }

    if (!record.generatedPaper) {
      logInfo("generation_result_pending", { jobId }, requestId);
      return sendSuccess(res, 202, { status: "pending" }, { message: "Result not ready yet" });
    }

    logInfo("generation_result_success", { jobId, status: record.status }, requestId);

    return sendSuccess(res, 200, {
      paper: record.generatedPaper,
      job: {
        jobId: record.jobId,
        assignmentId: record.assignmentId,
        status: record.status,
        progress: record.progress,
        message: record.message,
        startedAt: record.startedAt,
        completedAt: record.completedAt,
        error: record.error,
      },
    });
  };

  const regenerate = async (req: Request, res: Response) => {
    const requestId = String(res.locals.requestId ?? "n/a");
    const authUserId = String(res.locals.authUserId ?? "demo-user-001");
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    if (!jobId) {
      logError("generation_regenerate_invalid_job_id", undefined, requestId);
      return sendError(res, 400, "INVALID_JOB_ID", "Invalid job id");
    }

    const record = await GenerationRecordModel.findOne({ jobId, userId: authUserId }).lean();
    if (!record) {
      logError("generation_regenerate_source_not_found", { sourceJobId: jobId }, requestId);
      return sendError(res, 404, "JOB_NOT_FOUND", "Job not found");
    }

    const parsed = generationRequestSchema.safeParse(record.request);
    if (!parsed.success) {
      logError("generation_regenerate_stored_request_invalid", { sourceJobId: jobId }, requestId);
      return sendError(res, 400, "INVALID_STORED_REQUEST", "Stored request is invalid for regeneration");
    }

    const job = startGeneration(io, parsed.data as GenerationRequestPayload);
    logInfo("generation_regenerate_accepted", { sourceJobId: jobId, newJobId: job.jobId }, requestId);

    return sendSuccess(res, 202, { job, sourceJobId: jobId });
  };

  return { start, getById, getResult, regenerate };
}