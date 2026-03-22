import { Download } from "lucide-react";

type OutputHeaderProps = {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onDownload?: () => void;
};

export function OutputHeader({ title, subtitle, ctaLabel = "Download as PDF", onDownload }: OutputHeaderProps) {
  return (
    <div className="no-print rounded-2xl border border-slate-700 bg-[#1b1d22] p-4 text-white shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-sm font-semibold leading-relaxed text-white md:text-base">{title}</h1>
          <p className="mt-1 text-xs leading-relaxed text-white/80 md:text-sm">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onDownload}
          aria-label={ctaLabel}
          disabled={!onDownload}
          className="inline-flex items-center gap-2 rounded-full bg-[#181818] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
        >
          <Download className="h-3.5 w-3.5" />
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}