import type { Request, Response } from "express";
import { AssignmentModel } from "./assignment.model";
import { assignmentCreateSchema } from "./assignment.schema";
import { GenerationRecordModel } from "../generation/generation.model";
import { logError, logInfo } from "../../utils/logger";
import { sendError, sendSuccess } from "../../utils/response";
import type { AssignmentStatus } from "./assignment.types";

function mapStatus(rawStatus: string | undefined): AssignmentStatus {
  if (rawStatus === "queued") {
    return "queued";
  }

  if (rawStatus === "processing") {
    return "processing";
  }

  if (rawStatus === "failed") {
    return "failed";
  }

  if (rawStatus === "completed") {
    return "generated";
  }

  return "draft";
}

function formatDate(input: string | undefined) {
  if (!input) {
    return "N/A";
  }

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }

  return date.toLocaleDateString("en-GB");
}

export function createAssignmentController() {
  const createOrUpdate = async (req: Request, res: Response) => {
    const requestId = String(res.locals.requestId ?? "n/a");
    const authUserId = String(res.locals.authUserId ?? "demo-user-001");
    const parsed = assignmentCreateSchema.safeParse(req.body);

    if (!parsed.success) {
      logError("assignment_create_validation_failed", { issueCount: parsed.error.issues.length }, requestId);
      return sendError(res, 400, "INVALID_ASSIGNMENT_REQUEST", "Invalid assignment payload", parsed.error.issues);
    }

    const payload = parsed.data;
    const saved = await AssignmentModel.findOneAndUpdate(
      { userId: authUserId, assignmentId: payload.assignmentId },
      {
        userId: authUserId,
        assignmentId: payload.assignmentId,
        title: payload.title,
        dueDate: payload.dueDate,
        questionTypes: payload.questionTypes,
        totalQuestions: payload.totalQuestions,
        totalMarks: payload.totalMarks,
        additionalInstructions: payload.additionalInstructions,
        sourceFileAttached: payload.sourceFileAttached,
      },
      { upsert: true, new: true },
    ).lean();

    logInfo("assignment_create_success", { assignmentId: payload.assignmentId }, requestId);

    return sendSuccess(res, 200, {
      assignment: {
        id: saved?.assignmentId,
        title: saved?.title,
        dueDate: saved?.dueDate,
      },
    });
  };

  const list = async (_req: Request, res: Response) => {
    const requestId = String(res.locals.requestId ?? "n/a");
    const authUserId = String(res.locals.authUserId ?? "demo-user-001");

    const assignments = await AssignmentModel.find({ userId: authUserId }).sort({ createdAt: -1 }).lean();

    const items = await Promise.all(
      assignments.map(async (assignment) => {
        const latestGeneration = await GenerationRecordModel.findOne({
          userId: authUserId,
          assignmentId: assignment.assignmentId,
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          id: assignment.assignmentId,
          title: assignment.title,
          assignedOn: formatDate(assignment.createdAt instanceof Date ? assignment.createdAt.toISOString() : undefined),
          dueDate: formatDate(assignment.dueDate),
          totalQuestions: assignment.totalQuestions,
          totalMarks: assignment.totalMarks,
          status: mapStatus(latestGeneration?.status),
        };
      }),
    );

    logInfo("assignment_list_success", { count: items.length }, requestId);

    return sendSuccess(res, 200, {
      items,
      total: items.length,
    });
  };

  const getById = async (req: Request, res: Response) => {
    const requestId = String(res.locals.requestId ?? "n/a");
    const authUserId = String(res.locals.authUserId ?? "demo-user-001");
    const assignmentId = Array.isArray(req.params.assignmentId) ? req.params.assignmentId[0] : req.params.assignmentId;

    if (!assignmentId) {
      return sendError(res, 400, "INVALID_ASSIGNMENT_ID", "Invalid assignment id");
    }

    const assignment = await AssignmentModel.findOne({ userId: authUserId, assignmentId }).lean();
    if (!assignment) {
      return sendError(res, 404, "ASSIGNMENT_NOT_FOUND", "Assignment not found");
    }

    const latestGeneration = await GenerationRecordModel.findOne({ userId: authUserId, assignmentId })
      .sort({ createdAt: -1 })
      .lean();

    logInfo("assignment_detail_success", { assignmentId }, requestId);

    return sendSuccess(res, 200, {
      assignment: {
        id: assignment.assignmentId,
        title: assignment.title,
        dueDate: assignment.dueDate,
        assignedOn: formatDate(assignment.createdAt instanceof Date ? assignment.createdAt.toISOString() : undefined),
        totalQuestions: assignment.totalQuestions,
        totalMarks: assignment.totalMarks,
        additionalInstructions: assignment.additionalInstructions,
        status: mapStatus(latestGeneration?.status),
      },
      latestGeneration: latestGeneration
        ? {
            jobId: latestGeneration.jobId,
            status: latestGeneration.status,
            progress: latestGeneration.progress,
            message: latestGeneration.message,
            startedAt: latestGeneration.startedAt,
            completedAt: latestGeneration.completedAt,
            error: latestGeneration.error,
          }
        : null,
      paper: latestGeneration?.generatedPaper ?? null,
    });
  };

  const remove = async (req: Request, res: Response) => {
    const requestId = String(res.locals.requestId ?? "n/a");
    const authUserId = String(res.locals.authUserId ?? "demo-user-001");
    const assignmentId = Array.isArray(req.params.assignmentId) ? req.params.assignmentId[0] : req.params.assignmentId;

    if (!assignmentId) {
      return sendError(res, 400, "INVALID_ASSIGNMENT_ID", "Invalid assignment id");
    }

    const deletedAssignment = await AssignmentModel.findOneAndDelete({
      userId: authUserId,
      assignmentId,
    }).lean();

    if (!deletedAssignment) {
      return sendError(res, 404, "ASSIGNMENT_NOT_FOUND", "Assignment not found");
    }

    const generationDeleteResult = await GenerationRecordModel.deleteMany({
      userId: authUserId,
      assignmentId,
    });

    logInfo(
      "assignment_delete_success",
      {
        assignmentId,
        generationRecordsDeleted: generationDeleteResult.deletedCount ?? 0,
      },
      requestId,
    );

    return sendSuccess(res, 200, {
      deleted: true,
      assignmentId,
    });
  };

  return {
    createOrUpdate,
    list,
    getById,
    remove,
  };
}
