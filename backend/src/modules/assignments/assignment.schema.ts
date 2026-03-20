import { z } from "zod";

const assignmentQuestionTypeSchema = z.object({
  type: z.string().min(1),
  numberOfQuestions: z.number().int().positive(),
  marksPerQuestion: z.number().positive(),
  totalMarks: z.number().positive(),
});

export const assignmentCreateSchema = z.object({
  assignmentId: z.string().min(1),
  title: z.string().min(1).max(120),
  dueDate: z.string().min(1),
  questionTypes: z.array(assignmentQuestionTypeSchema).min(1),
  totalQuestions: z.number().int().positive(),
  totalMarks: z.number().positive(),
  additionalInstructions: z.string().max(1000).optional(),
  sourceFileAttached: z.boolean(),
});

export type AssignmentCreateInput = z.infer<typeof assignmentCreateSchema>;
