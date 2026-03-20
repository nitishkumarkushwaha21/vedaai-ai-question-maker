"use client";

import { CreateAssignmentForm } from "@/components/create-assignment/create-assignment-form";
import { useAssignmentDraftStore } from "@/store/assignment-draft-store";

export default function CreateAssignmentPage() {
  const hasDraft = Boolean(useAssignmentDraftStore((state) => state.assignmentDraft));

  return (
    <section className="space-y-4 pb-20 md:pb-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Create Assignment</h1>
        <p className="text-sm text-gray-500">Set up a new assignment for your students.</p>
      </header>

      <p className="text-xs font-medium text-gray-500">
        {hasDraft ? "Draft in progress" : "Start filling details"}
      </p>

      <CreateAssignmentForm />
    </section>
  );
}