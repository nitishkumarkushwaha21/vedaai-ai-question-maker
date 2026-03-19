import { create } from "zustand";
import type { CreateAssignmentFormValues } from "@/modules/assignments/schema";

type AssignmentDraftStoreState = {
  assignmentDraft: CreateAssignmentFormValues | null;
  setAssignmentDraft: (draft: CreateAssignmentFormValues) => void;
  resetAssignmentDraft: () => void;
};

export const useAssignmentDraftStore = create<AssignmentDraftStoreState>((set) => ({
  assignmentDraft: null,
  setAssignmentDraft: (draft) => set({ assignmentDraft: draft }),
  resetAssignmentDraft: () => set({ assignmentDraft: null }),
}));