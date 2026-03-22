type AssignmentsGridSkeletonProps = {
  count?: number;
};

export function AssignmentsGridSkeleton({ count = 6 }: AssignmentsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-2 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={`assignment-skeleton-${index}`}
          className="mx-auto h-[116px] w-full max-w-[373px] rounded-[24px] border border-[#eceff3] bg-[#FFFFFFBF] p-5 shadow-sm md:mx-0 md:h-[162px] md:max-w-none md:bg-white md:p-4"
        >
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-3/4 rounded-lg bg-slate-200" />
            <div className="h-4 w-1/2 rounded-lg bg-slate-100" />
            <div className="mt-6 flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-slate-100" />
              <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}