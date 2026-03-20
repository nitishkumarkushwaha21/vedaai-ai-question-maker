"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderOpen, Home, Plus, Settings, Sparkles, Users } from "lucide-react";
import { useAuthStore } from "@/auth/auth.store";
import { SIDEBAR_NAV_ITEMS } from "@/constants/nav-items";
import { ROUTES } from "@/lib/routes";

const ICONS = {
  home: Home,
  groups: Users,
  assignments: FolderOpen,
  toolkit: Sparkles,
  library: BookOpen,
} as const;

export function DesktopSidebarNav() {
  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);
  const userName = profile.userName || "John Doe";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-auto w-full flex-col rounded-[16px] bg-white p-6 shadow-[0_32px_48px_rgba(0,0,0,0.2),0_16px_48px_rgba(0,0,0,0.12)] md:h-[756px] md:w-[304px]">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white">
          <Image src="/v-icon.webp" alt="VedaAI icon" width={40} height={40} className="h-10 w-10 rounded-xl object-cover" />
        </span>
        <p className="text-4xl font-semibold leading-none text-slate-800">VedaAI</p>
      </div>

      <Link
        href={ROUTES.CREATE_ASSIGNMENT}
        className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border-2 border-orange-400 bg-[#181818] px-4 py-2 text-sm font-medium text-white"
      >
        <Plus className="h-4 w-4" />
        Create Assignment
      </Link>

      <nav className="space-y-1.5">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          const isDisabled = !!item.disabled;
          const Icon = ICONS[item.iconKey as keyof typeof ICONS] ?? FolderOpen;

          if (isDisabled) {
            return (
              <div
                key={item.id}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.id === "assignments" ? (
                <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-semibold text-white">10</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link href={ROUTES.AUTH_PROFILE} className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-50">
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3">
          {profile.schoolIconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.schoolIconUrl}
              alt="School icon"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-xs font-semibold text-amber-900">{initials}</span>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-800">{profile.schoolName || "Delhi Public School"}</p>
            <p className="text-xs text-slate-500">{profile.schoolLocation || "Bokaro Steel City"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}