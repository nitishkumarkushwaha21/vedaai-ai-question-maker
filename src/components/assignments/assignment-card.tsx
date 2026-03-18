import type { AssignmentCard as AssignmentCardType } from "@/types/assignment";
import { MoreVertical } from "lucide-react";

type AssignmentCardProps = {
  item: AssignmentCardType;
};

export function AssignmentCard({ item }: AssignmentCardProps) {
  return (
    <article className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-2">
        <h2 className="text-3xl font-semibold leading-none text-gray-900">{item.title}</h2>
        <button type="button" aria-label="Open assignment actions" className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Assigned on: <span className="font-semibold text-gray-800">{item.assignedOn}</span>
        </p>
        <p>
          Due: <span className="font-semibold text-gray-800">{item.dueDate}</span>
        </p>
      </div>
    </article>
  );
}