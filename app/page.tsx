import Link from "next/link";
import { DesktopSidebarNav } from "@/components/shell/desktop-sidebar";
import { MobileBottomNavbar } from "@/components/shell/mobile-bottom";
import { ROUTES } from "@/lib/routes";



export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#222]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 p-3 md:flex-row md:p-5">
        <aside className="hidden md:block md:w-[260px] lg:w-[280px]">
          <DesktopSidebarNav />
        </aside>

        <main className="min-w-0 flex-1 rounded-2xl bg-white/60 p-6 md:p-8">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">VedaAI Frontend</h1>
          <p className="mb-8 text-sm text-gray-600">Choose a page to continue development.</p>

          <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
            <Link
              href={ROUTES.ASSIGNMENTS}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-gray-800 shadow-sm"
            >
              Assignments
            </Link>
            <Link
              href={ROUTES.CREATE_ASSIGNMENT}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-gray-800 shadow-sm"
            >
              Create Assignment
            </Link>
            <Link
              href={ROUTES.AI_TOOLKIT}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-gray-800 shadow-sm"
            >
              AI Toolkit
            </Link>
          </div>
        </main>
      </div>

      <div className="md:hidden">
        <MobileBottomNavbar />
      </div>
    </div>
  );
}
