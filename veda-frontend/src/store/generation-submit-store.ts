import { create } from "zustand";
import type { GenerationStatus } from "@/types/generation-status";
import type { GenerationSubmitDraft } from "@/types/generation-request";

type GenerationSubmitStoreState = {
	generationSubmitDraft: GenerationSubmitDraft | null;
	setGenerationSubmitDraft: (draft: GenerationSubmitDraft) => void;
	updateGenerationSubmitStatus: (status: GenerationStatus) => void;
	resetGenerationSubmitDraft: () => void;
};

export const useGenerationSubmitStore = create<GenerationSubmitStoreState>((set) => ({
	generationSubmitDraft: null,
	setGenerationSubmitDraft: (draft) => set({ generationSubmitDraft: draft }),
	updateGenerationSubmitStatus: (status) =>
		set((state) => {
			if (!state.generationSubmitDraft) {
				return state;
			}

			return {
				generationSubmitDraft: {
					...state.generationSubmitDraft,
					clientStatus: status,
				},
			};
		}),
	resetGenerationSubmitDraft: () => set({ generationSubmitDraft: null }),
}));