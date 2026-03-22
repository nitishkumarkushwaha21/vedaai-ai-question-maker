import { Download, FileText } from "lucide-react";

type OutputHeaderProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onDownload?: () => void;
};

export function OutputHeader({
  title,
  subtitle,
  ctaLabel = "Download as PDF",
  onDownload,
}: OutputHeaderProps) {
  return (
    <div className="no-print rounded-2xl border border-slate-700 bg-[#1b1d22] p-4 text-white shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-sm font-semibold leading-relaxed text-white md:text-base">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-xs leading-relaxed text-white/80 md:text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onDownload}
          aria-label={ctaLabel}
          disabled={!onDownload}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2a2d33] text-white disabled:cursor-not-allowed disabled:opacity-60 md:h-[44px] md:w-[200px] md:gap-2 md:bg-white md:px-6 md:text-sm md:text-[#111111] md:ring-1 md:ring-[#eceff3]"
        >
          <Download className="h-5 w-5 md:hidden" />
          <FileText className="hidden h-6 w-6 md:block" />
          <span className="hidden md:inline">{ctaLabel}</span>
        </button>
      </div>
    </div>
  );
}
