export function GenerationPaperSkeleton() {
  return (
    <section className="space-y-4 pb-20 md:pb-4">
      <div className="rounded-2xl border border-slate-700 bg-[#1b1d22] p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-4/5 rounded bg-white/25" />
          <div className="h-3 w-3/5 rounded bg-white/20" />
        </div>
      </div>

      <article className="rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm md:px-6 md:py-8">
        <div className="animate-pulse">
          <div className="mx-auto mb-2 h-7 w-2/3 rounded bg-slate-200 md:h-10" />
          <div className="mx-auto mb-2 h-5 w-1/2 rounded bg-slate-200 md:h-8" />
          <div className="mx-auto mb-5 h-5 w-1/3 rounded bg-slate-200 md:h-8" />

          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="h-3 w-40 rounded bg-slate-200" />
            <div className="h-3 w-36 rounded bg-slate-200" />
          </div>

          <div className="mb-4 h-3 w-3/4 rounded bg-slate-200" />

          <div className="mb-6 space-y-2">
            <div className="h-3 w-52 rounded bg-slate-200" />
            <div className="h-3 w-56 rounded bg-slate-200" />
            <div className="h-3 w-60 rounded bg-slate-200" />
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-11/12 rounded bg-slate-100" />
              <div className="h-3 w-10/12 rounded bg-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-11/12 rounded bg-slate-100" />
              <div className="h-3 w-10/12 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
