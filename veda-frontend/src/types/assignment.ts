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

export type AssignmentDetail = AssignmentCard & {
  additionalInstructions?: string;
};

export type AssignmentsListResponse = {
  items: AssignmentCard[];
  total: number;
};

export type AssignmentGenerationSnapshot = {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  message: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
};