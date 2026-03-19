import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export function AssignmentsEmptyState() {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
      <h2 className="mb-2 text-2xl font-semibold text-gray-900">No assignments yet</h2>
      <p className="mx-auto mb-5 max-w-xl text-gray-500">
        Create your first assignment to start collecting and grading student submissions.
      </p>
      <Link
        href={ROUTES.CREATE_ASSIGNMENT}
        className="inline-flex rounded-full bg-[#1f1f1f] px-5 py-2 text-sm font-medium text-white"
      >
        + Create Your First Assignment
      </Link>
    </div>
  );
}