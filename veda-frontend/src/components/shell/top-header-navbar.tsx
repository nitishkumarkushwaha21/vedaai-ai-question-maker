"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Bell, ChevronDown, ArrowLeft, Grid2X2, Menu } from "lucide-react";
import { useAuthStore } from "@/auth/auth.store";
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
	const { signOut: clerkSignOut } = useClerk();
	const localSignOut = useAuthStore((state) => state.signOut);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const displayName = userName.trim().split(/\s+/)[0] || "John";

	const initials = userName
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	useEffect(() => {
		function onClickOutside(event: MouseEvent) {
			if (!menuRef.current) {
				return;
			}

			if (!menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		}

		if (menuOpen) {
			document.addEventListener("mousedown", onClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", onClickOutside);
		};
	}, [menuOpen]);

	const handleSwitchAccount = async () => {
		setMenuOpen(false);
		try {
			await clerkSignOut();
		} catch {
			// Continue with local sign out even if remote sign out fails.
		}
		localSignOut();
		router.push(ROUTES.SIGNUP);
	};

	return (
		<header ref={menuRef} className="relative mb-4 rounded-2xl bg-white px-3 py-2 shadow-sm md:h-[56px] md:w-full md:px-4 md:py-0">
			<div className="hidden items-center justify-between gap-3 md:h-full md:flex">
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

					<button
						type="button"
						onClick={() => setMenuOpen((prev) => !prev)}
						className="inline-flex items-center gap-2 rounded-full px-1 py-1 hover:bg-slate-100"
						aria-label="Open profile menu"
					>
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
							{initials}
						</span>
						<span className="text-sm font-semibold text-slate-800">{displayName}</span>
						<ChevronDown className="h-4 w-4 text-slate-500" />
					</button>
				</div>
			</div>

			<div className="flex items-center justify-between gap-3 md:hidden">
				<div className="flex items-center gap-2">
					<Image src="/v-icon.webp" alt="VedaAI icon" width={38} height={38} className="h-[38px] w-[38px] rounded-xl object-cover" />
					<p className="text-[18px] font-semibold leading-none text-slate-800">VedaAI</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						type="button"
						className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
						aria-label="Notifications"
					>
						<Bell className="h-5 w-5" />
						<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
					</button>

					<button
						type="button"
						onClick={() => setMenuOpen((prev) => !prev)}
						aria-label="Open profile"
						className="inline-flex items-center"
					>
						<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
							{initials}
						</span>
					</button>

					<button
						type="button"
						onClick={() => setMenuOpen((prev) => !prev)}
						aria-label="Open menu"
						className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700"
					>
						<Menu className="h-7 w-7" strokeWidth={2.6} />
					</button>
				</div>
			</div>

			{menuOpen ? (
				<div className="absolute right-3 top-[54px] z-50 min-w-[170px] rounded-xl bg-[#181818] p-2 shadow-[0_12px_28px_rgba(15,23,42,0.35)] md:right-4 md:top-[52px]">
					<Link
						href={ROUTES.AUTH_PROFILE}
						onClick={() => setMenuOpen(false)}
						className="block rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
					>
						Profile
					</Link>
					<button
						type="button"
						onClick={() => void handleSwitchAccount()}
						className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-white hover:bg-white/10"
					>
						Switch Account
					</button>
				</div>
			) : null}
		</header>
	);
}