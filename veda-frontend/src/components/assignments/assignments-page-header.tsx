type AssignmentsPageHeaderProps = {
  totalCount: number;
};

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function AssignmentsPageHeader({ totalCount }: AssignmentsPageHeaderProps) {
  const router = useRouter();

  return (
    <header className="rounded-2xl bg-transparent px-0 py-3 md:px-4">
      <div className="mb-1 flex items-center justify-between md:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#cfd4db] text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <h1 className="text-base font-semibold text-gray-900">Assignments</h1>
        <span className="h-9 w-9" aria-hidden="true" />
      </div>

      <div className="hidden items-start justify-between gap-3 md:flex">
        <div className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-200/80 shadow-[0_0_0_8px_rgba(110,231,183,0.24)]"
            aria-hidden="true"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>
            <p className="text-sm text-gray-500">Manage and create assignments for your classes.</p>
          </div>
        </div>
        <div>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {totalCount} total
          </span>
        </div>
      </div>
    </header>
  );
}
