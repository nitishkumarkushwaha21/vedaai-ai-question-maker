import type { GenerationStatus } from "@/types/generation-status";

export type QuestionTypeRequest = {
	type: string;
	numberOfQuestions: number;
	marksPerQuestion: number;
	totalMarks: number;
};

export type GenerationRequestPayload = {
	userId: string;
	assignmentId: string;
	dueDate: string;
	questionTypes: QuestionTypeRequest[];
	totalQuestions: number;
	totalMarks: number;
	additionalInstructions?: string;
	specialInstruction: {
		enabled: boolean;
		text?: string;
	};
	sourceFileAttached: boolean;
	profile?: {
		userName?: string;
		schoolName?: string;
		schoolLocation?: string;
		schoolIconUrl?: string;
		teacherSubject?: string;
		className?: string;
		subject?: string;
		timeAllowedMinutes?: number;
	};
	expectedOutput: {
		sections: string[];
		includeDifficulty: boolean;
		includeMarks: boolean;
		sectionGroupingTag?: "question-type" | "difficulty" | "marks";
	};
};

export type GenerationSubmitDraft = {
	request: GenerationRequestPayload;
	clientStatus: GenerationStatus;
};