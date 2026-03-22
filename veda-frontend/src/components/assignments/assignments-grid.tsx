import type { AssignmentCard as AssignmentCardType } from "@/types/assignment";
import { AssignmentCard } from "@/components/assignments/assignment-card";

type AssignmentsGridProps = {
  items: AssignmentCardType[];
  onDeleteAssignment: (assignmentId: string) => Promise<void>;
  deletingAssignmentId?: string | null;
};

export function AssignmentsGrid({ items, onDeleteAssignment, deletingAssignmentId }: AssignmentsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-2 lg:grid-cols-2">
      {items.map((item) => (
        <AssignmentCard
          key={item.id}
          item={item}
          onDeleteAssignment={onDeleteAssignment}
          deleting={deletingAssignmentId === item.id}
        />
      ))}
    </div>
  );
}