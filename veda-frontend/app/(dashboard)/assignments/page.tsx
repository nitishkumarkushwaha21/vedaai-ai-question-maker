"use client";
import type { AssignmentCard } from "@/types/assignment";
import { useState } from "react";
import { AssignmentsGrid } from "@/components/assignments/assignments-grid";
import { AssignmentsEmptyState } from "@/components/assignments/assignments-empty-state";
import { AssignmentsToolbar } from "@/components/assignments/assignments-toolbar";
import { AssignmentsPageHeader } from "@/components/assignments/assignments-page-header";


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
  const [showEmpty, setShowEmpty] = useState(false);
  const [search, setSearch] = useState("");

  const items = showEmpty
    ? []
    : MOCK_ASSIGNMENTS.filter((item) => item.title.toLowerCase().includes(search.toLowerCase().trim()));

  return (
    <section className="space-y-4 pb-20 md:pb-4">
      <AssignmentsPageHeader totalCount={items.length} />

      <AssignmentsToolbar
        searchValue={search}
        onSearchChange={setSearch}
        onToggleEmpty={() => setShowEmpty((prev) => !prev)}
      />

      {items.length > 0 ? <AssignmentsGrid items={items} /> : <AssignmentsEmptyState />}
    </section>
  );
}