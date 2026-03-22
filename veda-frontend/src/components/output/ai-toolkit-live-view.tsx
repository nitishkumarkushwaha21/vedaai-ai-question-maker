"use client";

import { OutputHeader } from "@/components/output/output-header";
import { ExamPaperSheet } from "@/components/output/exam-paper-sheet";
import { downloadQuestionPaperPdf } from "@/lib/pdf";
import type { GenerationJob } from "@/types/generation-status";
import type { QuestionPaper } from "@/types/question-paper";

type AIToolkitLiveViewProps = {
	job: GenerationJob;
	socketConnected: boolean;
	paper: QuestionPaper;
	userName?: string;
};

export function AIToolkitLiveView({ job, socketConnected, paper, userName = "John Doe" }: AIToolkitLiveViewProps) {
	const handleDownloadPdf = async () => {
		await downloadQuestionPaperPdf({
			paper,
			fileName: `${paper.assignmentId || "question-paper"}.pdf`,
		});
	};

	return (
		<section className="space-y-4 pb-20 md:pb-4">
			<OutputHeader
				title={`Certainly, ${userName}! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:`}
				subtitle={socketConnected ? `Live output synced with backend generation status. Current status: ${job.status}.` : "Live updates disconnected. Showing latest available paper."}
				onDownload={handleDownloadPdf}
			/>
			<div id="print-area">
				<ExamPaperSheet paper={paper} />
			</div>
		</section>
	);
}