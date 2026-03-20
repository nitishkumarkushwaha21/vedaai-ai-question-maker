import { z } from "zod";

export const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
] as const;

export const questionTypeRowSchema = z.object({
  type: z.enum(QUESTION_TYPE_OPTIONS),
  numberOfQuestions: z.number().int().min(1, "Must be at least 1"),
  marksPerQuestion: z.number().int().min(1, "Must be at least 1"),
});

export const createAssignmentSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "Only PDF files are allowed")
    .refine((file) => file.size <= 10 * 1024 * 1024, "File size must be 10MB or less")
    .optional(),
  dueDate: z.string().min(1, "Due date is required"),
  questionRows: z.array(questionTypeRowSchema).min(1, "Add at least one question type"),
  additionalInstructions: z.string().max(500, "Max 500 characters").optional(),
});

export type CreateAssignmentFormValues = z.infer<typeof createAssignmentSchema>;