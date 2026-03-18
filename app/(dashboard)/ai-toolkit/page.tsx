import { AIToolkitLiveView } from "@/components/output/ai-toolkit-live-view";
import type { GenerationJob } from "@/types/generation-status";
import type { QuestionPaper } from "@/types/question-paper";

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
	return <AIToolkitLiveView assignmentId={MOCK_JOB.assignmentId} initialJob={MOCK_JOB} paper={MOCK_PAPER} />;
}