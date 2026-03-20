"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderOpen, Home, Sparkles, Users } from "lucide-react";
import { MOBILE_NAV_ITEMS } from "@/constants/nav-items";

const ICONS = {
  home: Home,
  groups: Users,
  library: BookOpen,
  toolkit: Sparkles,
  assignments: FolderOpen,
} as const;

export function MobileBottomNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-2xl bg-[#181818] p-2 shadow-[0_10px_30px_rgba(2,8,23,0.35)]">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          const isDisabled = !!item.disabled;
          const Icon = ICONS[item.iconKey as keyof typeof ICONS] ?? FolderOpen;

          if (isDisabled) {
            return (
              <div
                key={item.id}
                className="rounded-xl px-2 py-1.5 text-center text-[11px] text-slate-500"
              >
                <Icon className="mx-auto mb-1 h-4 w-4" />
                {item.label}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`rounded-xl px-2 py-1.5 text-center text-[11px] ${
                isActive ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-300"
              }`}
            >
              <Icon className="mx-auto mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}