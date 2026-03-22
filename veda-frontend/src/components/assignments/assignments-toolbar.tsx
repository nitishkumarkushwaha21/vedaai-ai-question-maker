import { Funnel, Search } from "lucide-react";

type AssignmentsToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function AssignmentsToolbar({ searchValue, onSearchChange }: AssignmentsToolbarProps) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex items-center gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <button
          type="button"
          className="inline-flex h-5 w-[55px] items-center gap-1.5 rounded-xl text-[11px] text-slate-500 md:h-[20px] md:w-[77px] md:gap-1"
        >
          <Funnel className="h-4 w-4 md:h-3 md:w-3" />
          Filter by
        </button>

        <div className="relative ml-auto w-[228px] flex-none md:ml-auto md:w-[380px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            placeholder="Search Name"
            className="h-[44px] w-[228px] rounded-[100px] border border-slate-200 px-4 py-[11px] pl-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 md:h-[44px] md:w-[380px] md:rounded-full md:py-2 md:pl-9 md:pr-4"
          />
        </div>
      </div>
    </div>
  );
}
