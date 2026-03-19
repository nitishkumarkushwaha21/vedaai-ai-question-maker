"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ITEMS } from "@/constants/nav-items";

export function MobileBottomNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white px-2 py-2">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          const isDisabled = !!item.disabled;

          if (isDisabled) {
            return (
              <div
                key={item.id}
                className="rounded-md px-2 py-2 text-center text-xs text-gray-400"
              >
                {item.label}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`rounded-md px-2 py-2 text-center text-xs ${
                isActive ? "bg-gray-100 font-medium text-gray-900" : "text-gray-600"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}