type AssignmentsPageHeaderProps = {
  totalCount: number;
};

export function AssignmentsPageHeader({ totalCount }: AssignmentsPageHeaderProps) {
  return (
    <header className="rounded-2xl bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start gap-2">
        <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>
          <p className="text-sm text-gray-500">Manage and create assignments for your classes.</p>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-400">Total: {totalCount}</p>
    </header>
  );
}
