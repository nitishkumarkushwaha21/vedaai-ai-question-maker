"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Download, FileText, Loader2 } from "lucide-react";
import { ENV } from "@/lib/env";
import { ROUTES } from "@/lib/routes";
import type { AssignmentDetail, AssignmentGenerationSnapshot } from "@/types/assignment";
import type { QuestionPaper } from "@/types/question-paper";
import { ExamPaperSheet } from "@/components/output/exam-paper-sheet";

type AssignmentDetailData = {
  assignment: AssignmentDetail;
  latestGeneration: AssignmentGenerationSnapshot | null;
  paper: QuestionPaper | null;
};

type SuccessEnvelope<TData> = {
  ok: true;
  data: TData;
};

type ErrorEnvelope = {
  ok: false;
  error?: {
    message?: string;
  };
};

export default function AssignmentDetailPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = Array.isArray(params.assignmentId) ? params.assignmentId[0] : params.assignmentId;
  const { getToken, userId } = useAuth();

  const [data, setData] = useState<AssignmentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) {
      return;
    }

    let cancelled = false;

    const loadAssignment = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await fetch(`${ENV.API_URL}/assignments/${assignmentId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "x-user-id": userId ?? "demo-user-001",
          },
        });

        const payload = (await response.json()) as SuccessEnvelope<AssignmentDetailData> | ErrorEnvelope;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.ok ? "Failed to load assignment" : (payload.error?.message ?? "Failed to load assignment"));
        }

        if (!cancelled) {
          setData(payload.data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : "Failed to load assignment");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAssignment();

    return () => {
      cancelled = true;
    };
  }, [assignmentId, getToken, userId]);

  const prettyStatus = useMemo(() => {
    const status = data?.assignment.status;
    if (!status) {
      return "Draft";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  }, [data?.assignment.status]);

  const downloadPaperJson = () => {
    if (!data?.paper) {
      return;
    }

    const blob = new Blob([JSON.stringify(data.paper, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${data.assignment.id}-paper.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6 pb-20 md:pb-4">
      <Link href={ROUTES.ASSIGNMENTS} className="text-sm font-medium text-slate-600 hover:text-slate-900">
        Back to assignments
      </Link>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading assignment...
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {!loading && !error && data ? (
        <>
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">{data.assignment.title}</h1>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-2">
              <p>
                Assigned on: <span className="font-semibold text-slate-900">{data.assignment.assignedOn}</span>
              </p>
              <p>
                Due date: <span className="font-semibold text-slate-900">{data.assignment.dueDate}</span>
              </p>
              <p>
                Total questions: <span className="font-semibold text-slate-900">{data.assignment.totalQuestions ?? "-"}</span>
              </p>
              <p>
                Total marks: <span className="font-semibold text-slate-900">{data.assignment.totalMarks ?? "-"}</span>
              </p>
              <p>
                Status: <span className="font-semibold text-slate-900">{prettyStatus}</span>
              </p>
            </div>

            {data.assignment.additionalInstructions ? (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Additional instructions</p>
                <p className="mt-1 whitespace-pre-line">{data.assignment.additionalInstructions}</p>
              </div>
            ) : null}

            {data.latestGeneration ? (
              <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                <p>
                  Latest generation: <span className="font-semibold text-slate-900">{data.latestGeneration.status}</span>
                </p>
                <p>
                  Progress: <span className="font-semibold text-slate-900">{data.latestGeneration.progress}%</span>
                </p>
                <p>
                  Message: <span className="font-semibold text-slate-900">{data.latestGeneration.message}</span>
                </p>
              </div>
            ) : null}
          </article>

          {data.paper ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <FileText className="h-4 w-4" />
                  Generated question paper
                </div>
                <button
                  type="button"
                  onClick={downloadPaperJson}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
              <ExamPaperSheet paper={data.paper} />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
              Generated paper is not available yet.
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
