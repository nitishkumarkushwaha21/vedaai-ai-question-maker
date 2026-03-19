import type { AssignmentCard as AssignmentCardType } from "@/types/assignment";
import { AssignmentCard } from "@/components/assignments/assignment-card";

type AssignmentsGridProps = {
  items: AssignmentCardType[];
};

export function AssignmentsGrid({ items }: AssignmentsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {items.map((item) => (
        <AssignmentCard key={item.id} item={item} />
      ))}
    </div>
  );
}