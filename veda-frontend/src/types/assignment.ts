export type AssignmentStatus = "draft" | "queued" | "processing" | "generated" | "failed";

export type AssignmentCard = {
  id: string;
  title: string;
  assignedOn: string;
  dueDate: string;
  totalQuestions?: number;
  totalMarks?: number;
  status?: AssignmentStatus;
};

export type AssignmentsListResponse = {
  items: AssignmentCard[];
  total: number;
};