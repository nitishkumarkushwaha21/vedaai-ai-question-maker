/*
 * Called by dashboard route to render AI toolkit page.
 * Calls backend start/result APIs and reads socket-driven job state from generation store.
 * This file manages draft preview, start/regenerate actions, completion-triggered result fetch, and retry UI.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AIToolkitLiveView } from "@/components/output/ai-toolkit-live-view";
import { ENV } from "@/lib/env";
import { useGenerationStore } from "@/store/generation-store";
import { useGenerationSubmitStore } from "@/store/generation-submit-store";
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
	status?: "pending";
};

type RegenerateGenerationResponseData = {
	job?: GenerationJob;
	sourceJobId?: string;
};

const MOCK_JOB: GenerationJob = {
	jobId: "job-001",
	assignmentId: "a1",
	status: "processing",
	progress: 65,
	message: "Generating section-level questions and marks split...",
	startedAt: "2026-03-18T10:00:00.000Z",
};

const MOCK_PAPER: QuestionPaper = {
	assignmentId: "a1",
	schoolName: "Delhi Public School, Sector-4, Bokaro",
	subject: "English",
	className: "5th",
	timeAllowedMinutes: 45,
	maxMarks: 20,
	studentFields: {
		name: true,
		rollNumber: true,
		section: true,
	},
	sections: [
		{
			id: "sec-a",
			title: "Section A",
			instruction: "Attempt all questions. Each question carries 2 marks.",
			questions: [
				{
					id: "q1",
					text: "Define electroplating. Explain its purpose.",
					marks: 2,
					difficulty: "easy",
				},
				{
					id: "q2",
					text: "What is the role of a conductor in electrolysis?",
					marks: 2,
					difficulty: "medium",
				},
			],
		},
	],
	answerKey: ["Sample key line 1", "Sample key line 2"],
};

export default function AIToolkitPage() {
	const [isStarting, setIsStarting] = useState(false);
	const [isRegenerating, setIsRegenerating] = useState(false);
	const [startError, setStartError] = useState<string | null>(null);
	const [resultInfo, setResultInfo] = useState<string | null>(null);
	const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
	const [activePaper, setActivePaper] = useState<QuestionPaper>(MOCK_PAPER);
	const latestFetchedResultJobIdRef = useRef<string | null>(null);

	const generationJobFromStore = useGenerationStore((state) => state.generationJob);
	const generationSubmitDraft = useGenerationSubmitStore((state) => state.generationSubmitDraft);
	const updateGenerationSubmitStatus = useGenerationSubmitStore((state) => state.updateGenerationSubmitStatus);
	const resetGenerationSubmitDraft = useGenerationSubmitStore((state) => state.resetGenerationSubmitDraft);

	const draftRequest = generationSubmitDraft?.request;
	const assignmentId = draftRequest?.assignmentId ?? MOCK_JOB.assignmentId;

	const initialJob: GenerationJob = activeJob
		? activeJob
		: draftRequest
		? {
				...MOCK_JOB,
				assignmentId,
				status: generationSubmitDraft?.clientStatus ?? "queued",
				message: "Draft loaded. Ready to start generation.",
			}
		: MOCK_JOB;

	const fetchGenerationResult = useCallback(async (jobId: string) => {
		const resultResponse = await fetch(`${ENV.API_URL}/generation/${jobId}/result`);
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

		if (resultData.paper) {
			setActivePaper(resultData.paper);
		}

		if (resultData.job) {
			setActiveJob(resultData.job);
			updateGenerationSubmitStatus(resultData.job.status);
		}

		setResultInfo("Latest generated paper loaded from backend.");
		latestFetchedResultJobIdRef.current = jobId;
	}, [updateGenerationSubmitStatus]);

	useEffect(() => {
		if (!generationJobFromStore) {
			return;
		}

		setActiveJob(generationJobFromStore);
		updateGenerationSubmitStatus(generationJobFromStore.status);

		if (
			generationJobFromStore.status === "completed" &&
			latestFetchedResultJobIdRef.current !== generationJobFromStore.jobId
		) {
			void fetchGenerationResult(generationJobFromStore.jobId).catch((error: unknown) => {
				setStartError(error instanceof Error ? error.message : "Failed to fetch generation result");
			});
		}
	}, [fetchGenerationResult, generationJobFromStore, updateGenerationSubmitStatus]);

	const startGenerationFromBackend = async () => {
		if (!draftRequest) {
			return;
		}

		setIsStarting(true);
		setStartError(null);
		setResultInfo(null);

		try {
			const response = await fetch(`${ENV.API_URL}/generation/start`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(draftRequest),
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
	};

	const regenerateFromBackend = async () => {
		if (!activeJob) {
			return;
		}

		setIsRegenerating(true);
		setStartError(null);
		setResultInfo("Regeneration started. Waiting for socket completion...");

		try {
			const response = await fetch(`${ENV.API_URL}/generation/${activeJob.jobId}/regenerate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
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

	return (
		<div className="space-y-4">
			{draftRequest ? (
				<section className="rounded-xl border border-slate-200 bg-white p-4">
					<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Draft Summary</p>
					<div className="mt-2 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-3">
						<p>Due Date: {draftRequest.dueDate || "N/A"}</p>
						<p>Total Questions: {draftRequest.totalQuestions}</p>
						<p>Total Marks: {draftRequest.totalMarks}</p>
					</div>
				</section>
			) : null}

			<section className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
				<div className="flex items-center justify-between gap-3">
					<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Temporary Request Preview</p>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={startGenerationFromBackend}
							disabled={!draftRequest || isStarting || isRegenerating}
							className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isStarting ? "Starting..." : "Start Generation"}
						</button>

						<button
							type="button"
							onClick={regenerateFromBackend}
							disabled={!activeJob || isRegenerating || isStarting}
							className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isRegenerating ? "Regenerating..." : "Regenerate"}
						</button>

						{generationSubmitDraft ? (
							<button
								type="button"
								onClick={resetGenerationSubmitDraft}
								className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
							>
								Clear Draft
							</button>
						) : null}
					</div>
				</div>

				{generationSubmitDraft ? (
					<>
						<p className="mt-1 text-xs text-slate-600">Client status: {generationSubmitDraft.clientStatus}</p>
						<pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
							{JSON.stringify(generationSubmitDraft.request, null, 2)}
						</pre>
					</>
				) : (
					<p className="mt-1 text-sm text-slate-600">No request drafted yet. Create an assignment to preview the payload.</p>
				)}

				{!draftRequest ? (
					<p className="mt-2 text-xs text-slate-500">Create an assignment first, then return here to start generation.</p>
				) : null}

				{startError ? <p className="mt-2 text-xs text-rose-600">{startError}</p> : null}
				{resultInfo ? <p className="mt-2 text-xs text-slate-600">{resultInfo}</p> : null}

				{activeJob ? (
					<button
						type="button"
						onClick={() => {
							void fetchGenerationResult(activeJob.jobId).catch((error: unknown) => {
								setStartError(error instanceof Error ? error.message : "Failed to fetch generation result");
							});
						}}
						className="mt-2 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
					>
						Retry Result Fetch
					</button>
				) : null}
			</section>

			<AIToolkitLiveView assignmentId={assignmentId} initialJob={initialJob} paper={activePaper} />
		</div>
	);
}