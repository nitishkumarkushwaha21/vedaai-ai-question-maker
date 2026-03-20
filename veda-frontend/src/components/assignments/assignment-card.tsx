"use client";

import type { AssignmentCard as AssignmentCardType } from "@/types/assignment";
import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

type AssignmentCardProps = {
  item: AssignmentCardType;
};

export function AssignmentCard({ item }: AssignmentCardProps) {
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

  return (
    <article className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-2">
        <h2 className="text-[38px] font-semibold leading-none text-slate-800">{item.title}</h2>

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
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen ? (
            <div
              id={menuId}
              role="menu"
              aria-label="Assignment actions"
              className="absolute right-0 top-7 z-20 min-w-[132px] rounded-xl border border-slate-100 bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.16)]"
            >
              <button
                type="button"
                role="menuitem"
                className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                View Assignment
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-rose-500 hover:bg-rose-50"
                onClick={() => setMenuOpen(false)}
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>
          Assigned on: <span className="font-semibold text-slate-800">{item.assignedOn}</span>
        </p>
        <p>
          Due: <span className="font-semibold text-slate-800">{item.dueDate}</span>
        </p>
      </div>
    </article>
  );
}