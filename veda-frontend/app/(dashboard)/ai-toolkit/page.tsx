/*
 * Called by dashboard route to render AI toolkit page.
 * Calls backend start/result APIs and reads socket-driven job state from generation store.
 * This file manages draft preview, start/regenerate actions, completion-triggered result fetch, and retry UI.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { AIToolkitLiveView } from "@/components/output/ai-toolkit-live-view";
import { GenerationPaperSkeleton } from "@/components/output/generation-paper-skeleton";
import { useGenerationStatusSocket } from "@/hooks/use-generation-status-socket";
import { ENV } from "@/lib/env";
import { useAssignmentDraftStore } from "@/store/assignment-draft-store";
import { useGenerationSubmitStore } from "@/store/generation-submit-store";
import { useAuthStore } from "@/auth/auth.store";
import type { GenerationJob } from "@/types/generation-status";
import type { QuestionPaper } from "@/types/question-paper";

type ApiSuccessEnvelope<TData> = {
	ok: true;
	data: TData;
	meta?: {
		message?: string;
	};
};

type ApiErrorEnvelope = {
	ok: false;
	error?: {
		message?: string;
	};
};

type StartGenerationResponseData = {
	job?: GenerationJob;
};

type GenerationResultResponseData = {
	paper?: QuestionPaper;
	job?: GenerationJob;
	status?: "pending" | "failed";
};

type RegenerateGenerationResponseData = {
	job?: GenerationJob;
	sourceJobId?: string;
};

export default function AIToolkitPage() {
	const [isStarting, setIsStarting] = useState(false);
	const [isRegenerating, setIsRegenerating] = useState(false);
	const [startError, setStartError] = useState<string | null>(null);
	const [resultInfo, setResultInfo] = useState<string | null>(null);
	const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
	const [activePaper, setActivePaper] = useState<QuestionPaper | null>(null);
	const latestFetchedResultJobIdRef = useRef<string | null>(null);
	const autoStartHandledRef = useRef(false);

	const generationSubmitDraft = useGenerationSubmitStore((state) => state.generationSubmitDraft);
	const updateGenerationSubmitStatus = useGenerationSubmitStore((state) => state.updateGenerationSubmitStatus);
	const assignmentDraft = useAssignmentDraftStore((state) => state.assignmentDraft);
  const session = useAuthStore((state) => state.session);
  const profile = useAuthStore((state) => state.profile);
	const { getToken, userId: clerkUserId } = useAuth();

	const resolvedUserId = clerkUserId ?? session.userId ?? "demo-user-001";

	const draftRequest = generationSubmitDraft?.request;
	const assignmentId = draftRequest?.assignmentId ?? activeJob?.assignmentId ?? "";

	const initialJob: GenerationJob | null = useMemo(() => {
		if (activeJob) {
			return activeJob;
		}

		if (draftRequest) {
			return {
				jobId: "",
				assignmentId,
				status: generationSubmitDraft?.clientStatus ?? "queued",
				progress: 0,
				message: "Draft loaded. Ready to start generation.",
				startedAt: new Date().toISOString(),
			};
		}

		return null;
	}, [activeJob, assignmentId, draftRequest, generationSubmitDraft?.clientStatus]);

	const { job: socketJob, socketConnected } = useGenerationStatusSocket({
		assignmentId,
		initialJob,
	});

	const fetchGenerationResult = useCallback(async (jobId: string) => {
		const token = await getToken();
		const resultResponse = await fetch(`${ENV.API_URL}/generation/${jobId}/result`, {
			headers: {
				...(token ? { Authorization: `Bearer ${token}` } : {}),
				"x-user-id": resolvedUserId,
			},
		});
		const resultPayload = (await resultResponse.json()) as
			| ApiSuccessEnvelope<GenerationResultResponseData>
			| ApiErrorEnvelope;

		if (resultResponse.status === 202) {
			if (resultPayload.ok) {
				setResultInfo(resultPayload.meta?.message ?? "Result not ready yet. Use retry after a few seconds.");
			} else {
				setResultInfo("Result not ready yet. Use retry after a few seconds.");
			}
			return;
		}

		if (!resultResponse.ok) {
			throw new Error(resultPayload.ok ? "Failed to fetch generation result" : (resultPayload.error?.message ?? "Failed to fetch generation result"));
		}

		if (!resultPayload.ok) {
			throw new Error("Failed to fetch generation result");
		}

		const resultData = resultPayload.data;

		if (resultData.status === "failed") {
			if (resultData.job) {
				setActiveJob(resultData.job);
				updateGenerationSubmitStatus("failed");
			}

			throw new Error(resultPayload.meta?.message ?? resultData.job?.error ?? "Generation failed");
		}

		if (resultData.paper) {
			setActivePaper(resultData.paper);
		}

		if (resultData.job) {
			setActiveJob(resultData.job);
			updateGenerationSubmitStatus(resultData.job.status);
		}

		setResultInfo("Latest generated paper loaded from backend.");
		latestFetchedResultJobIdRef.current = jobId;
	}, [getToken, resolvedUserId, updateGenerationSubmitStatus]);

	useEffect(() => {
		if (!socketJob || !socketJob.jobId) {
			return;
		}

		setActiveJob(socketJob);
		updateGenerationSubmitStatus(socketJob.status);

		if (
			socketJob.status === "completed" &&
			latestFetchedResultJobIdRef.current !== socketJob.jobId
		) {
			void fetchGenerationResult(socketJob.jobId).catch((error: unknown) => {
				setStartError(error instanceof Error ? error.message : "Failed to fetch generation result");
			});
		}
	}, [fetchGenerationResult, socketJob, updateGenerationSubmitStatus]);

	useEffect(() => {
		const candidateJobId = activeJob?.jobId || latestFetchedResultJobIdRef.current;
		const status = socketJob?.status ?? activeJob?.status;

		if (!candidateJobId || (status !== "queued" && status !== "processing")) {
			return;
		}

		const intervalId = window.setInterval(() => {
			void fetchGenerationResult(candidateJobId).catch(() => {
				// Keep polling quietly until backend marks completion or explicit failure appears.
			});
		}, 3500);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [activeJob?.jobId, activeJob?.status, fetchGenerationResult, socketJob?.status]);

	const startGenerationFromBackend = useCallback(async () => {
		if (!draftRequest) {
			return;
		}

		setIsStarting(true);
		setActivePaper(null);
		setStartError(null);
		setResultInfo(null);

		try {
			const token = await getToken();
			const sourceFile = assignmentDraft?.file;
			const requestPayload = {
				...draftRequest,
				userId: resolvedUserId || draftRequest.userId,
				profile,
				sourceFileAttached: Boolean(sourceFile),
			};

			const requestInit: RequestInit = sourceFile
				? (() => {
						const formData = new FormData();
						formData.append("request", JSON.stringify(requestPayload));
						formData.append("file", sourceFile);
						return {
							method: "POST",
							headers: {
								...(token ? { Authorization: `Bearer ${token}` } : {}),
								"x-user-id": resolvedUserId,
							},
							body: formData,
						};
				  })()
				: {
						method: "POST",
						headers: {
							...(token ? { Authorization: `Bearer ${token}` } : {}),
							"Content-Type": "application/json",
							"x-user-id": resolvedUserId,
						},
						body: JSON.stringify(requestPayload),
				  };

			const response = await fetch(`${ENV.API_URL}/generation/start`, {
				...requestInit,
			});
			const payload = (await response.json()) as ApiSuccessEnvelope<StartGenerationResponseData> | ApiErrorEnvelope;

			if (!response.ok) {
				throw new Error(payload.ok ? "Failed to start generation" : (payload.error?.message ?? "Failed to start generation"));
			}

			if (!payload.ok) {
				throw new Error("Failed to start generation");
			}

			const data = payload.data;

			if (data.job) {
				setActiveJob(data.job);
				setResultInfo("Generation started. Waiting for socket completion...");
				latestFetchedResultJobIdRef.current = null;
				updateGenerationSubmitStatus(data.job.status);
			}
		} catch (error) {
			updateGenerationSubmitStatus("failed");
			setStartError(error instanceof Error ? error.message : "Failed to start generation");
		} finally {
			setIsStarting(false);
		}
	}, [assignmentDraft?.file, draftRequest, getToken, profile, resolvedUserId, updateGenerationSubmitStatus]);

	useEffect(() => {
		const shouldAutoStart = new URLSearchParams(window.location.search).get("autostart") === "1";

		if (!shouldAutoStart || autoStartHandledRef.current || !draftRequest || Boolean(activeJob)) {
			return;
		}

		autoStartHandledRef.current = true;
		void startGenerationFromBackend();
	}, [activeJob, draftRequest, startGenerationFromBackend]);

	const regenerateSourceJobId = socketJob?.jobId || activeJob?.jobId || latestFetchedResultJobIdRef.current;

	const regenerateFromBackend = async () => {
		if (!regenerateSourceJobId) {
			await startGenerationFromBackend();
			return;
		}

		setIsRegenerating(true);
		setActivePaper(null);
		setStartError(null);
		setResultInfo("Regeneration started. Waiting for socket completion...");

		try {
			const token = await getToken();
			const response = await fetch(`${ENV.API_URL}/generation/${regenerateSourceJobId}/regenerate`, {
				method: "POST",
				headers: {
					...(token ? { Authorization: `Bearer ${token}` } : {}),
					"Content-Type": "application/json",
					"x-user-id": resolvedUserId,
				},
			});
			const payload = (await response.json()) as
				| ApiSuccessEnvelope<RegenerateGenerationResponseData>
				| ApiErrorEnvelope;

			if (!response.ok) {
				throw new Error(payload.ok ? "Failed to regenerate question paper" : (payload.error?.message ?? "Failed to regenerate question paper"));
			}

			if (!payload.ok) {
				throw new Error("Failed to regenerate question paper");
			}

			const data = payload.data;

			if (data.job) {
				setActiveJob(data.job);
				updateGenerationSubmitStatus(data.job.status);
				latestFetchedResultJobIdRef.current = null;
			}
		} catch (error) {
			updateGenerationSubmitStatus("failed");
			setStartError(error instanceof Error ? error.message : "Failed to regenerate question paper");
		} finally {
			setIsRegenerating(false);
		}
	};

	const currentStatus = socketJob?.status ?? activeJob?.status ?? generationSubmitDraft?.clientStatus;
	const rawProgress = socketJob?.progress ?? activeJob?.progress ?? 0;
	const progressPercent = currentStatus === "completed"
		? 100
		: currentStatus === "failed"
			? 0
			: Math.max(0, Math.min(100, rawProgress));
	const showPaperSkeleton =
		isStarting ||
		isRegenerating ||
		currentStatus === "queued" ||
		currentStatus === "processing";

	return (
		<div className="space-y-4">
			{draftRequest ? (
				<section className="rounded-xl border border-slate-200 bg-white p-3">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div>
							<p className="text-sm font-semibold text-slate-900 underline">Draft summary</p>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={regenerateFromBackend}
								disabled={!draftRequest || isRegenerating || isStarting}
								className="rounded-full bg-[#181818] px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isRegenerating || isStarting ? "Regenerating..." : "Regenerate"}
							</button>
						</div>
					</div>

					<div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700 md:grid-cols-4">
						<p>Due: {draftRequest.dueDate || "N/A"}</p>
						<p>Questions: {draftRequest.totalQuestions}</p>
						<p>Marks: {draftRequest.totalMarks}</p>
						<p>Status: {generationSubmitDraft?.clientStatus ?? "queued"}</p>
					</div>

					{startError ? <p className="mt-2 text-xs text-rose-600">{startError}</p> : null}
					{resultInfo ? <p className="mt-1 text-xs text-slate-600">{resultInfo}</p> : null}

					<div className="mt-3 border-t border-slate-200 pt-2">
						<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
							<div
								className={`h-1.5 rounded-full transition-all duration-500 ${currentStatus === "failed" ? "bg-rose-500" : "bg-[#181818]"}`}
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
					</div>
				</section>
			) : null}

			{!draftRequest ? (
				<section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
					No draft available. Create an assignment first, then return here to start generation.
				</section>
			) : null}

			{showPaperSkeleton ? (
				<GenerationPaperSkeleton />
			) : activePaper && activeJob ? (
				<AIToolkitLiveView
					job={socketJob ?? activeJob}
					socketConnected={socketConnected}
					paper={activePaper}
					userName={profile?.userName}
				/>
			) : draftRequest ? (
				<section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
					No generated paper yet. Start generation and wait for completion.
				</section>
			) : null}
		</div>
	);
}