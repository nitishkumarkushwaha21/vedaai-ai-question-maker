import type { QuestionPaper } from "@/types/question-paper";

export type GenerationStatus = "queued" | "processing" | "completed" | "failed";

export type GenerationJob = {
	jobId: string;
	assignmentId: string;
	status: GenerationStatus;
	progress: number; // 0 to 100
	message?: string;
	error?: string;
	startedAt?: string;
	completedAt?: string;
};

export type GenerationSocketEvent =
	| "generation:queued"
	| "generation:processing"
	| "generation:completed"
	| "generation:failed";

export type SocketEnvelope<TPayload> = {
	event: GenerationSocketEvent;
	timestamp: string;
	payload: TPayload;
};

export type GenerationResult = {
	job: GenerationJob;
	paper?: QuestionPaper;
};

export type GenerationSocketPayload = SocketEnvelope<GenerationResult>;