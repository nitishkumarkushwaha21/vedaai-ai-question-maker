"use client";
import type { AssignmentCard } from "@/types/assignment";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { AssignmentsGrid } from "@/components/assignments/assignments-grid";
import { AssignmentsEmptyState } from "@/components/assignments/assignments-empty-state";
import { AssignmentsToolbar } from "@/components/assignments/assignments-toolbar";
import { AssignmentsPageHeader } from "@/components/assignments/assignments-page-header";
import { ENV } from "@/lib/env";
import { ROUTES } from "@/lib/routes";

type ApiSuccessEnvelope<TData> = {
  ok: true;
  data: TData;
};

type ApiErrorEnvelope = {
  ok: false;
  error?: {
    message?: string;
  };
};

type AssignmentListApiResponse = {
  items: AssignmentCard[];
  total: number;
};

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<AssignmentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<string | null>(null);
  const { getToken, userId } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const loadAssignments = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await fetch(`${ENV.API_URL}/assignments`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "x-user-id": userId ?? "demo-user-001",
          },
        });
        const payload = (await response.json()) as ApiSuccessEnvelope<AssignmentListApiResponse> | ApiErrorEnvelope;

        if (!response.ok || !payload.ok) {
          throw new Error(payload.ok ? "Failed to fetch assignments" : (payload.error?.message ?? "Failed to fetch assignments"));
        }

        if (!cancelled) {
          setItems(payload.data.items);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch assignments");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAssignments();

    return () => {
      cancelled = true;
    };
  }, [getToken, userId]);

  const filteredItems = useMemo(
    () => items.filter((item) => item.title.toLowerCase().includes(search.toLowerCase().trim())),
    [items, search],
  );

  const handleDeleteAssignment = async (assignmentId: string) => {
    setError(null);
    setDeletingAssignmentId(assignmentId);

    try {
      const token = await getToken();
      const response = await fetch(`${ENV.API_URL}/assignments/${assignmentId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-user-id": userId ?? "demo-user-001",
        },
      });

      const payload = (await response.json()) as { ok: boolean; error?: { message?: string } };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error?.message ?? "Failed to delete assignment");
      }

      setItems((prev) => prev.filter((item) => item.id !== assignmentId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete assignment");
    } finally {
      setDeletingAssignmentId(null);
    }
  };

  return (
    <section className="space-y-4 pb-20 md:pb-4">
      <AssignmentsPageHeader totalCount={filteredItems.length} />

      <AssignmentsToolbar searchValue={search} onSearchChange={setSearch} />

      {loading ? <p className="text-sm text-slate-500">Loading assignments...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {!loading && !error ? (
        filteredItems.length > 0 ? (
          <AssignmentsGrid
            items={filteredItems}
            onDeleteAssignment={handleDeleteAssignment}
            deletingAssignmentId={deletingAssignmentId}
          />
        ) : (
          <AssignmentsEmptyState />
        )
      ) : null}

      {filteredItems.length > 0 ? (
        <Link
          href={ROUTES.CREATE_ASSIGNMENT}
          className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 rounded-full bg-[#111318] px-6 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(2,8,23,0.35)] md:inline-flex"
        >
          + Create Assignment
        </Link>
      ) : null}

      {filteredItems.length > 0 ? (
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