"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DesktopSidebarNav } from "@/components/shell/desktop-sidebar";
import { MobileBottomNavbar } from "@/components/shell/mobile-bottom";
import { TopHeaderNavbar } from "@/components/shell/top-header-navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const headerTitle =
    pathname === "/assignments/new"
      ? "Create Assignment"
      : pathname === "/ai-toolkit"
        ? "AI Teacher's Toolkit"
        : pathname === "/assignments"
          ? "Assignments"
          : "Assignment";

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#222]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 p-3 md:flex-row md:p-5">
        <aside className="hidden md:block md:w-[260px] lg:w-[280px]">
          <DesktopSidebarNav />
        </aside>

        <main className="min-w-0 flex-1 rounded-2xl bg-white/60 p-3 md:p-5">
          <TopHeaderNavbar title={headerTitle} userName="John Doe" />
          {children}
        </main>
      </div>

      <div className="md:hidden">
        <MobileBottomNavbar />
      </div>
    </div>
  );
}