import { create } from "zustand";
import type { GenerationJob } from "@/types/generation-status";
import type { QuestionPaper } from "@/types/question-paper";

type GenerationStoreState = {
	generationJob: GenerationJob | null;
	generationPaper: QuestionPaper | null;
	socketConnected: boolean;
	setGenerationJob: (job: GenerationJob) => void;
	setGenerationPaper: (paper: QuestionPaper) => void;
	setSocketConnected: (connected: boolean) => void;
	hydrateGeneration: (job: GenerationJob, paper: QuestionPaper) => void;
	resetGeneration: () => void;
};

export const useGenerationStore = create<GenerationStoreState>((set) => ({
	generationJob: null,
	generationPaper: null,
	socketConnected: false,

	setGenerationJob: (job) => set({ generationJob: job }),
	setGenerationPaper: (paper) => set({ generationPaper: paper }),
	setSocketConnected: (connected) => set({ socketConnected: connected }),

	hydrateGeneration: (job, paper) =>
		set({
			generationJob: job,
			generationPaper: paper,
		}),

	resetGeneration: () =>
		set({
			generationJob: null,
			generationPaper: null,
			socketConnected: false,
		}),
}));