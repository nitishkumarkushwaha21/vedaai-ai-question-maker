import { Bell, ChevronDown, ArrowLeft } from "lucide-react";

type TopHeaderNavbarProps = {
	title?: string;
	userName?: string;
};

export function TopHeaderNavbar({
	title = "Assignment",
	userName = "John Doe",
}: TopHeaderNavbarProps) {
	return (
		<header className="mb-4 rounded-2xl bg-white px-3 py-2 shadow-sm md:px-4 md:py-3">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2 text-gray-600">
					<button type="button" className="rounded-full p-1 text-gray-500 hover:bg-gray-100" aria-label="Go back">
						<ArrowLeft className="h-4 w-4" />
					</button>
					<p className="text-sm font-medium text-gray-500">{title}</p>
				</div>

				<div className="flex items-center gap-3">
					<button type="button" className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100" aria-label="Notifications">
						<Bell className="h-4 w-4" />
						<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
					</button>

					<button type="button" className="inline-flex items-center gap-2 rounded-full px-1 py-1 hover:bg-gray-100" aria-label="Open profile menu">
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
							JD
						</span>
						<span className="text-sm font-medium text-gray-800">{userName}</span>
						<ChevronDown className="h-4 w-4 text-gray-500" />
					</button>
				</div>
			</div>
		</header>
	);
}