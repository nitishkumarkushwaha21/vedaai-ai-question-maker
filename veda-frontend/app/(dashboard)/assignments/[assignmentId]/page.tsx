"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Download, FileText, Loader2, PencilLine } from "lucide-react";
import { ENV } from "@/lib/env";
import { downloadQuestionPaperPdf } from "@/lib/pdf";
import { ROUTES } from "@/lib/routes";
import type { AssignmentDetail, AssignmentGenerationSnapshot } from "@/types/assignment";
import type { QuestionPaper } from "@/types/question-paper";
import { ExamPaperSheet } from "@/components/output/exam-paper-sheet";
import type { DifficultyDisplayMode } from "@/components/output/question-section-block";

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
  const [renameMode, setRenameMode] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [difficultyDisplayMode, setDifficultyDisplayMode] = useState<DifficultyDisplayMode>("color");

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
          setRenameTitle(payload.data.assignment.title);
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

  const downloadPaperPdf = async () => {
    if (!data?.paper) {
      return;
    }

    setDownloadingPdf(true);

    try {
      await downloadQuestionPaperPdf({
        paper: data.paper,
        fileName: `${data.assignment.id}-paper.pdf`,
        difficultyDisplayMode,
      });
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Failed to download PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleRename = async () => {
    if (!data || !assignmentId) {
      return;
    }

    const nextTitle = renameTitle.trim();
    if (!nextTitle) {
      setRenameError("Title is required");
      return;
    }

    if (nextTitle.length > 120) {
      setRenameError("Title must be at most 120 characters");
      return;
    }

    setRenameError(null);
    setRenaming(true);

    try {
      const token = await getToken();
      const response = await fetch(`${ENV.API_URL}/assignments/${assignmentId}/rename`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-user-id": userId ?? "demo-user-001",
        },
        body: JSON.stringify({ title: nextTitle }),
      });

      const payload = (await response.json()) as { ok: boolean; data?: { assignment?: { title?: string } }; error?: { message?: string } };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error?.message ?? "Failed to rename assignment");
      }

      const savedTitle = payload.data?.assignment?.title ?? nextTitle;
      setData((prev) => (prev ? { ...prev, assignment: { ...prev.assignment, title: savedTitle } } : prev));
      setRenameTitle(savedTitle);
      setRenameMode(false);
    } catch (renameFailure) {
      setRenameError(renameFailure instanceof Error ? renameFailure.message : "Failed to rename assignment");
    } finally {
      setRenaming(false);
    }
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
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {renameMode ? (
                  <>
                    <input
                      value={renameTitle}
                      onChange={(event) => setRenameTitle(event.target.value)}
                      className="w-full border-b-2 border-[#181818] bg-transparent pb-1 text-2xl font-semibold text-slate-900 outline-none"
                    />
                    {renameError ? <p className="mt-1 text-xs text-rose-600">{renameError}</p> : null}
                  </>
                ) : (
                  <h1 className="truncate text-2xl font-semibold text-slate-900">{data.assignment.title}</h1>
                )}
              </div>

              {renameMode ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRenameMode(false);
                      setRenameError(null);
                      setRenameTitle(data.assignment.title);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRename}
                    disabled={renaming}
                    className="rounded-full bg-[#181818] px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    {renaming ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setRenameMode(true);
                    setRenameError(null);
                    setRenameTitle(data.assignment.title);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#181818] px-3 py-1.5 text-xs font-medium text-white"
                >
                  <PencilLine className="h-3.5 w-3.5" />
                  Rename
                </button>
              )}
            </div>

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
          </article>

          {data.paper ? (
            <div className="space-y-3">
              <div className="no-print space-y-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <FileText className="h-4 w-4" />
                    Generated question paper
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={downloadPaperPdf}
                      disabled={downloadingPdf}
                      className="inline-flex items-center gap-1 rounded-full bg-[#181818] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Download className="h-4 w-4" />
                      {downloadingPdf ? "Generating PDF..." : "Download PDF"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-medium text-slate-600">Difficulty view:</span>
                  <button
                    type="button"
                    onClick={() => setDifficultyDisplayMode("none")}
                    className={`rounded-full border px-3 py-1 ${difficultyDisplayMode === "none" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"}`}
                  >
                    No difficulty
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyDisplayMode("text")}
                    className={`rounded-full border px-3 py-1 ${difficultyDisplayMode === "text" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"}`}
                  >
                    [easy] text
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyDisplayMode("color")}
                    className={`rounded-full border px-3 py-1 ${difficultyDisplayMode === "color" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"}`}
                  >
                    Color badge
                  </button>
                </div>
              </div>
              <div id="print-area">
                <ExamPaperSheet paper={data.paper} difficultyDisplayMode={difficultyDisplayMode} />
              </div>
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
