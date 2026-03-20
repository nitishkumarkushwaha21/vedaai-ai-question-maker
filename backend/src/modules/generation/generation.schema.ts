import { z } from "zod";

export const questionTypeSchema = z.object({
  type: z.string().min(1),
  numberOfQuestions: z.number().int().positive(),
  marksPerQuestion: z.number().positive(),
  totalMarks: z.number().positive(),
});

export const generationRequestSchema = z.object({
  userId: z.string().min(1),
  assignmentId: z.string().min(1),
  dueDate: z.string().min(1),
  questionTypes: z.array(questionTypeSchema).min(1),
  totalQuestions: z.number().int().positive(),
  totalMarks: z.number().positive(),
  additionalInstructions: z.string().optional(),
  sourceFileAttached: z.boolean(),
  sourceMaterialText: z.string().optional(),
  sourceFileName: z.string().optional(),
  profile: z.object({
    userName: z.string().optional(),
    schoolName: z.string().optional(),
    schoolLocation: z.string().optional(),
    schoolIconUrl: z.string().optional(),
    teacherSubject: z.string().optional(),
    className: z.string().optional(),
    subject: z.string().optional(),
    timeAllowedMinutes: z.number().int().positive().optional(),
  }).optional(),
  expectedOutput: z.object({
    sections: z.array(z.string().min(1)).min(1),
    includeDifficulty: z.boolean(),
    includeMarks: z.boolean(),
  }),
});

export type GenerationRequestInput = z.infer<typeof generationRequestSchema>;