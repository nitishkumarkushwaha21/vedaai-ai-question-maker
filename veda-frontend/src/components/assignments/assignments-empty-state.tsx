import Link from "next/link";
import { CircleX, Search } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export function AssignmentsEmptyState() {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
      <div className="relative mx-auto mb-7 flex h-52 w-52 items-center justify-center rounded-full bg-slate-100">
        <div className="absolute -right-2 top-4 h-8 w-16 rounded-lg bg-white shadow-sm" />
        <div className="absolute -left-4 top-6 h-7 w-7 rounded-full border-2 border-slate-400" />

        <div className="rounded-3xl bg-white px-6 py-7 shadow-sm">
          <div className="mb-3 h-2 w-12 rounded-full bg-slate-800" />
          <div className="mb-2 h-2 w-12 rounded-full bg-slate-200" />
          <div className="mb-2 h-2 w-10 rounded-full bg-slate-200" />
          <div className="h-2 w-11 rounded-full bg-slate-200" />
        </div>

        <div className="absolute bottom-2 right-2 rounded-full border-8 border-violet-100 bg-white p-3 shadow-sm">
          <Search className="h-9 w-9 text-violet-300" />
          <CircleX className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white text-rose-500" />
        </div>
      </div>

      <h2 className="mb-2 text-4xl font-semibold text-slate-800">No assignments yet</h2>
      <p className="mx-auto mb-6 max-w-xl text-lg text-slate-500">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics,
        define marking criteria, and let AI assist with grading.
      </p>
      <Link
        href={ROUTES.CREATE_ASSIGNMENT}
        className="inline-flex rounded-full bg-[#101217] px-6 py-3 text-sm font-medium text-white"
      >
        + Create Your First Assignment
      </Link>
    </div>
  );
}