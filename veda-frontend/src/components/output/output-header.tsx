type OutputHeaderProps = {
  title: string;
  subtitle: string;
};

export function OutputHeader({ title, subtitle }: OutputHeaderProps) {
  return (
    <div className="rounded-2xl bg-[#1f1f1f] p-4 text-white shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
          <p className="text-sm text-white/80">{subtitle}</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}