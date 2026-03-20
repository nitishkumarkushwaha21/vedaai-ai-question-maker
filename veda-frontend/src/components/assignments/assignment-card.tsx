"use client";

import type { AssignmentCard as AssignmentCardType } from "@/types/assignment";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { ROUTES } from "@/lib/routes";

type AssignmentCardProps = {
  item: AssignmentCardType;
  onDeleteAssignment: (assignmentId: string) => Promise<void>;
  deleting?: boolean;
};

export function AssignmentCard({ item, onDeleteAssignment, deleting = false }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", onClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    function onEscClose(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("keydown", onEscClose);
    }

    return () => {
      document.removeEventListener("keydown", onEscClose);
    };
  }, [menuOpen]);

  const menuId = `assignment-actions-${item.id}`;
  const detailHref = `${ROUTES.ASSIGNMENTS}/${item.id}`;

  return (
    <article className="flex flex-col rounded-[24px] border border-[#eceff3] bg-white p-3.5 shadow-sm md:h-[162px] md:p-4">
      <div className="mb-5 flex items-start justify-between gap-2">
        <div className="h-[29px] overflow-hidden">
          <Link href={detailHref} className="block text-[28px] font-semibold leading-[29px] text-[#2b2f36] hover:underline">
            {item.title}
          </Link>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Open assignment actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>

          {menuOpen ? (
            <div
              id={menuId}
              role="menu"
              aria-label="Assignment actions"
              className="absolute right-0 top-7 z-20 min-w-[140px] rounded-xl border border-slate-100 bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.16)]"
            >
              <Link
                href={detailHref}
                role="menuitem"
                className="block w-full whitespace-nowrap rounded-lg px-3 py-1.5 text-left text-[11px] text-slate-600 hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                View Assignment
              </Link>
              <button
                type="button"
                role="menuitem"
                disabled={deleting}
                className="block w-full whitespace-nowrap rounded-lg px-3 py-1.5 text-left text-[11px] text-rose-500 hover:bg-rose-50"
                onClick={async () => {
                  const approved = window.confirm("Delete this assignment and its generated paper history?");
                  if (!approved) {
                    return;
                  }

                  await onDeleteAssignment(item.id);
                  setMenuOpen(false);
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between text-[11px] text-[#9aa0a8] md:text-xs">
        <p>
          <span className="font-semibold text-[#262a30]">Assigned on:</span> {item.assignedOn}
        </p>
        <p>
          <span className="font-semibold text-[#262a30]">Due:</span> {item.dueDate}
        </p>
      </div>
    </article>
  );
}