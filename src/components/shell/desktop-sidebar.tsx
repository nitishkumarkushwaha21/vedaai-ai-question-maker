"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { SIDEBAR_NAV_ITEMS } from "@/constants/nav-items";
import { ROUTES } from "@/lib/routes";

export function DesktopSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-auto flex-col rounded-2xl bg-white p-4 shadow-sm md:h-[calc(100vh-40px)]">
      <div className="mb-4">
        <p className="text-2xl font-semibold">VedaAI</p>
      </div>

      <Link
        href={ROUTES.CREATE_ASSIGNMENT}
        className="mb-5 inline-flex items-center justify-center rounded-full bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white"
      >
        + Create Assignment
      </Link>

      <nav className="space-y-1">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          const isDisabled = !!item.disabled;

          if (isDisabled) {
            return (
              <div
                key={item.id}
                className="cursor-not-allowed rounded-lg px-3 py-2 text-sm text-gray-400"
              >
                {item.label}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                isActive ? "bg-gray-100 font-medium text-gray-900" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button type="button" className="mb-3 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-50">
          <Settings className="h-4 w-4" />
          Settings
        </button>

        <div className="rounded-xl bg-gray-50 p-3">
        <p className="text-sm font-semibold text-gray-800">Delhi Public School</p>
        <p className="text-xs text-gray-500">Bokaro Steel City</p>
        </div>
      </div>
    </div>
  );
}