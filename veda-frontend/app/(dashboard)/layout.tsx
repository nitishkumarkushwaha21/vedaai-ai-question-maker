"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useRequireAuth } from "@/auth/hooks/use-require-auth";
import { useAuthStore } from "@/auth/auth.store";
import { DesktopSidebarNav } from "@/components/shell/desktop-sidebar";
import { MobileBottomNavbar } from "@/components/shell/mobile-bottom";
import { TopHeaderNavbar } from "@/components/shell/top-header-navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  useRequireAuth();
  const pathname = usePathname();
  const userName = useAuthStore((state) => state.profile.userName);

  const headerTitle =
    pathname === "/assignments/new"
      ? "Create Assignment"
      : pathname === "/ai-toolkit"
        ? "AI Teacher's Toolkit"
        : pathname === "/assignments"
          ? "Assignments"
          : "Assignment";

  return (
    <div className="min-h-screen bg-[#e8eaee] text-[#222]">
      <div className="flex w-full flex-col gap-3 p-3 md:flex-row md:p-3">
        <aside className="hidden md:block md:h-[756px] md:w-[304px] md:shrink-0">
          <DesktopSidebarNav />
        </aside>

        <main className="min-w-0 flex-1 rounded-2xl border border-[#d7dbe2] bg-[#eef1f5] p-3 md:p-5">
          <div className="mx-auto w-full max-w-[1100px]">
            <TopHeaderNavbar title={headerTitle} userName={userName} />
            {children}
          </div>
        </main>
      </div>

      <div className="md:hidden">
        <MobileBottomNavbar />
      </div>
    </div>
  );
}