type AssignmentsPageHeaderProps = {
  totalCount: number;
};

export function AssignmentsPageHeader({ totalCount }: AssignmentsPageHeaderProps) {
  return (
    <header className="rounded-2xl border border-[#edf0f4] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
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
