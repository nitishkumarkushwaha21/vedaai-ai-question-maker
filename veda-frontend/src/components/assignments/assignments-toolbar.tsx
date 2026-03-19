import { Funnel, Search } from "lucide-react";

type AssignmentsToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleEmpty: () => void;
};

export function AssignmentsToolbar({ searchValue, onSearchChange, onToggleEmpty }: AssignmentsToolbarProps) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600"
        >
          <Funnel className="h-4 w-4" />
          Filter by
        </button>

        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              type="text"
              placeholder="Search Assignment"
              className="w-full rounded-full border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onToggleEmpty}
            className="rounded-full border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700"
          >
            Toggle Empty
          </button>
        </div>
      </div>
    </div>
  );
}
