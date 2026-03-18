"use client";

import { OutputHeader } from "@/components/output/output-header";
import { ExamPaperSheet } from "@/components/output/exam-paper-sheet";
import { GenerationStatusCard } from "@/components/output/generation-status-card";
import { useGenerationJobSocket } from "@/hooks/use-generation-status-socket";
import type { GenerationJob } from "@/types/generation-status";
import type { QuestionPaper } from "@/types/question-paper";

type AIToolkitLiveViewProps = {
	assignmentId: string;
	initialJob: GenerationJob;
	paper: QuestionPaper;
};

export function AIToolkitLiveView({ assignmentId, initialJob, paper }: AIToolkitLiveViewProps) {
	const { job, socketConnected } = useGenerationJobSocket({
		assignmentId,
		initialJob,
	});

	return (
		<section className="space-y-4 pb-20 md:pb-4">
			<OutputHeader
				title="Generated Question Paper"
				subtitle={socketConnected ? "Live updates connected" : "Live updates disconnected"}
			/>
			<GenerationStatusCard job={job} />
			<ExamPaperSheet paper={paper} />
		</section>
	);
}