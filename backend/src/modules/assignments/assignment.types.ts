export type AssignmentStatus = "draft" | "queued" | "processing" | "generated" | "failed";

export type AssignmentQuestionType = {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
  totalMarks: number;
};

export type AssignmentRecord = {
  userId: string;
  assignmentId: string;
  title: string;
  dueDate: string;
  questionTypes: AssignmentQuestionType[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  sourceFileAttached: boolean;
  createdAt?: string;
};
