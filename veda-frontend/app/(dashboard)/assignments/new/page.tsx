"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CreateAssignmentForm } from "@/components/create-assignment/create-assignment-form";
import { useAssignmentDraftStore } from "@/store/assignment-draft-store";

export default function CreateAssignmentPage() {
  const hasDraft = Boolean(useAssignmentDraftStore((state) => state.assignmentDraft));
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  return (
    <section className="space-y-4 pb-20 md:pb-4">
      <header className="space-y-2">
        <div className="flex items-center justify-between px-0 md:hidden">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#cfd4db] text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.6} />
          </button>
          <h1 className="text-[18px] font-semibold text-[#15171b]">Create Assignment</h1>
          <span className="h-9 w-9" aria-hidden="true" />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <h1 className="text-[18px] font-semibold text-[#15171b]">Create Assignment</h1>
        </div>

        <p className="hidden text-[11px] text-[#9aa0a8] md:block">Set up a new assignment for your students.</p>
        <div className="h-0.5 w-full rounded-full bg-[#d5d8de]">
          <div className="h-0.5 rounded-full bg-[#737883] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <p className="text-[11px] font-medium text-[#8b9098]">
        {hasDraft ? "Draft in progress" : "Start filling details"}
      </p>

      <CreateAssignmentForm onProgressChange={setProgress} />
    </section>
  );
}