import type { GenerationJob } from "@/types/generation-status";

type GenerationStatusCardProps = {
	job: GenerationJob;
};

const STATUS_LABEL: Record<GenerationJob["status"], string> = {
	queued: "Queued",
	processing: "Processing",
	completed: "Completed",
	failed: "Failed",
};

const STATUS_CLASS: Record<GenerationJob["status"], string> = {
	queued: "bg-amber-50 text-amber-700 border-amber-200",
	processing: "bg-blue-50 text-blue-700 border-blue-200",
	completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
	failed: "bg-red-50 text-red-700 border-red-200",
};

export function GenerationStatusCard({ job }: GenerationStatusCardProps) {
	return (
		<article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
			<div className="mb-3 flex items-center justify-between gap-2">
				<h2 className="text-sm font-semibold text-gray-900">Generation Job</h2>
				<span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_CLASS[job.status]}`}>
					{STATUS_LABEL[job.status]}
				</span>
			</div>

			<p className="text-sm text-gray-600">{job.message ?? "Waiting for updates..."}</p>

			<div className="mt-3">
				<div className="mb-1 flex items-center justify-between text-xs text-gray-500">
					<span>Progress</span>
					<span>{job.progress}%</span>
				</div>
				<div className="h-2 w-full rounded-full bg-gray-100">
					<div
						className="h-2 rounded-full bg-gray-800 transition-all"
						style={{ width: `${Math.max(0, Math.min(100, job.progress))}%` }}
					/>
				</div>
			</div>

			{job.error ? <p className="mt-3 text-xs text-red-600">{job.error}</p> : null}
		</article>
	);
}