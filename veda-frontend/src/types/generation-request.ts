import type { GenerationStatus } from "@/types/generation-status";

export type QuestionTypeRequest = {
	type: string;
	numberOfQuestions: number;
	marksPerQuestion: number;
	totalMarks: number;
};

export type GenerationRequestPayload = {
	assignmentId: string;
	dueDate: string;
	questionTypes: QuestionTypeRequest[];
	totalQuestions: number;
	totalMarks: number;
	additionalInstructions?: string;
	sourceFileAttached: boolean;
	expectedOutput: {
		sections: string[];
		includeDifficulty: boolean;
		includeMarks: boolean;
	};
};

export type GenerationSubmitDraft = {
	request: GenerationRequestPayload;
	clientStatus: GenerationStatus;
};