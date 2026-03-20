"use client";
import type { AssignmentCard } from "@/types/assignment";
import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AssignmentsGrid } from "@/components/assignments/assignments-grid";
import { AssignmentsEmptyState } from "@/components/assignments/assignments-empty-state";
import { AssignmentsToolbar } from "@/components/assignments/assignments-toolbar";
import { AssignmentsPageHeader } from "@/components/assignments/assignments-page-header";
import { ROUTES } from "@/lib/routes";


const MOCK_ASSIGNMENTS: AssignmentCard[] = [
  {
    id: "a1",
    title: "Quiz on Electricity",
    assignedOn: "20-06-2025",
    dueDate: "21-06-2025",
  },
  {
    id: "a2",
    title: "Quiz on Electricity",
    assignedOn: "20-06-2025",
    dueDate: "21-06-2025",
  },
];

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");

  const items = MOCK_ASSIGNMENTS.filter((item) => item.title.toLowerCase().includes(search.toLowerCase().trim()));

  return (
    <section className="space-y-4 pb-20 md:pb-4">
      <AssignmentsPageHeader totalCount={items.length} />

      <AssignmentsToolbar searchValue={search} onSearchChange={setSearch} />

      {items.length > 0 ? <AssignmentsGrid items={items} /> : <AssignmentsEmptyState />}

      {items.length > 0 ? (
        <Link
          href={ROUTES.CREATE_ASSIGNMENT}
          className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 rounded-full bg-[#111318] px-6 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(2,8,23,0.35)] md:inline-flex"
        >
          + Create Assignment
        </Link>
      ) : null}

      {items.length > 0 ? (
        <Link
          href={ROUTES.CREATE_ASSIGNMENT}
          aria-label="Create assignment"
          className="fixed bottom-24 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-500 shadow-[0_12px_28px_rgba(2,8,23,0.28)] md:hidden"
        >
          <Plus className="h-5 w-5" />
        </Link>
      ) : null}
    </section>
  );
}