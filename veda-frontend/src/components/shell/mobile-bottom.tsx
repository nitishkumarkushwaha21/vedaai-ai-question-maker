"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderOpen, Home, Sparkles, Users } from "lucide-react";
import { MOBILE_NAV_ITEMS } from "@/constants/nav-items";

function AssignmentTabIcon({ className }: { className?: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 0C5.46024 0 5.83333 0.373096 5.83333 0.833333H10.8333C10.8333 0.373096 11.2064 0 11.6667 0C12.1269 0 12.5 0.373096 12.5 0.833333C14.8012 0.833333 16.6667 2.69881 16.6667 5V12.5C16.6667 14.8012 14.8012 16.6667 12.5 16.6667H4.16667C1.86548 16.6667 0 14.8012 0 12.5V5C0 2.69881 1.86548 0.833333 4.16667 0.833333C4.16667 0.373096 4.53976 0 5 0ZM3.33333 6.66667C3.33333 6.20643 3.70643 5.83333 4.16667 5.83333H12.5C12.9602 5.83333 13.3333 6.20643 13.3333 6.66667C13.3333 7.1269 12.9602 7.5 12.5 7.5H4.16667C3.70643 7.5 3.33333 7.1269 3.33333 6.66667ZM10.8333 12.5C10.8333 12.0398 11.2064 11.6667 11.6667 11.6667H12.5C12.9602 11.6667 13.3333 12.0398 13.3333 12.5C13.3333 12.9602 12.9602 13.3333 12.5 13.3333H11.6667C11.2064 13.3333 10.8333 12.9602 10.8333 12.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

const ICONS = {
  home: Home,
  groups: Users,
  library: BookOpen,
  toolkit: Sparkles,
  assignments: AssignmentTabIcon,
} as const;

export function MobileBottomNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-3">
      <div className="mx-auto flex h-[72px] w-[373px] max-w-[calc(100vw-12px)] items-center justify-between rounded-[24px] bg-[#181818] px-6 py-2 shadow-[0_10px_30px_rgba(2,8,23,0.35)]">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
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