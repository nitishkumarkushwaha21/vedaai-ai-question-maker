import { z } from "zod";

export const questionTypeSchema = z.object({
  type: z.string().min(1),
  numberOfQuestions: z.number().int().positive(),
  marksPerQuestion: z.number().positive(),
  totalMarks: z.number().positive(),
});

export const generationRequestSchema = z.object({
  assignmentId: z.string().min(1),
  dueDate: z.string().min(1),
  questionTypes: z.array(questionTypeSchema).min(1),
  totalQuestions: z.number().int().positive(),
  totalMarks: z.number().positive(),
  additionalInstructions: z.string().optional(),
  sourceFileAttached: z.boolean(),
  expectedOutput: z.object({
    sections: z.array(z.string().min(1)).min(1),
    includeDifficulty: z.boolean(),
    includeMarks: z.boolean(),
  }),
});

export type GenerationRequestInput = z.infer<typeof generationRequestSchema>;