"use client";

import { useEffect } from "react";
import { OutputHeader } from "@/components/output/output-header";
import { ExamPaperSheet } from "@/components/output/exam-paper-sheet";
import { GenerationStatusCard } from "@/components/output/generation-status-card";
import { useGenerationStatusSocket } from "@/hooks/use-generation-status-socket";
import { useGenerationStore } from "@/store/generation-store";
import type { GenerationJob } from "@/types/generation-status";
import type { QuestionPaper } from "@/types/question-paper";

type AIToolkitLiveViewProps = {
	assignmentId: string;
	initialJob: GenerationJob;
	paper: QuestionPaper;
};

export function AIToolkitLiveView({ assignmentId, initialJob, paper }: AIToolkitLiveViewProps) {
	const { job, socketConnected } = useGenerationStatusSocket({
		assignmentId,
		initialJob,
	});

	const {
		generationJob,
		generationPaper,
		socketConnected: socketConnectedFromStore,
		hydrateGeneration,
		setGenerationJob,
		setSocketConnected,
	} = useGenerationStore();

	useEffect(() => {
		hydrateGeneration(initialJob, paper);
	}, [initialJob, paper, hydrateGeneration]);

	useEffect(() => {
		setGenerationJob(job);
		setSocketConnected(socketConnected);
	}, [job, socketConnected, setGenerationJob, setSocketConnected]);

	useEffect(() => {
		return () => {
			useGenerationStore.getState().resetGeneration();
		};
	}, []);

	if (!generationJob || !generationPaper) {
		return null;
	}

	return (
		<section className="space-y-4 pb-20 md:pb-4">
			<OutputHeader
				title="Generated Question Paper"
				subtitle={socketConnectedFromStore ? "Live updates connected" : "Live updates disconnected"}
			/>
			<GenerationStatusCard job={generationJob} />
			<ExamPaperSheet paper={generationPaper} />
		</section>
	);
}