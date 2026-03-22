"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, ArrowLeft, Grid2X2 } from "lucide-react";
import { ROUTES } from "@/lib/routes";

type TopHeaderNavbarProps = {
	title?: string;
	userName?: string;
};

export function TopHeaderNavbar({
	title = "Assignment",
	userName = "John Doe",
}: TopHeaderNavbarProps) {
	const router = useRouter();

	const initials = userName
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<header className="mb-4 rounded-2xl bg-white px-3 py-2 shadow-sm md:h-[56px] md:w-full md:px-4 md:py-0">
			<div className="flex items-center justify-between gap-3 md:h-full">
				<div className="flex items-center gap-2 text-slate-500">
					<button
						type="button"
						className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
						aria-label="Go back"
						onClick={() => router.back()}
					>
						<ArrowLeft className="h-4 w-4" />
					</button>
					<Grid2X2 className="h-4 w-4" />
					<p className="text-sm font-medium text-slate-400">{title}</p>
				</div>

				<div className="flex items-center gap-3">
					<button type="button" className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications">
						<Bell className="h-4 w-4" />
						<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
					</button>

					<Link href={ROUTES.AUTH_PROFILE} className="inline-flex items-center gap-2 rounded-full px-1 py-1 hover:bg-slate-100" aria-label="Open profile menu">
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
							{initials}
						</span>
						<span className="text-sm font-semibold text-slate-800">{userName}</span>
						<ChevronDown className="h-4 w-4 text-slate-500" />
					</Link>
				</div>
			</div>
		</header>
	);
}