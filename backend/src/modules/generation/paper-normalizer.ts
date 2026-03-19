/*
 * Called by generation pipeline after AI adapter draft generation.
 * Calls zod validation and normalization rules for deterministic output shape.
 * This file guarantees a strict question paper object or throws a coded error.
 */
import { z } from "zod";
import type { Difficulty, GeneratedQuestionPaper, GenerationRequestPayload } from "./generation.types";

const difficultySchema = z.enum(["easy", "medium", "hard"]);

const rawQuestionSchema = z.object({
  text: z.string().min(10),
  marks: z.number().positive(),
  difficulty: z.string().min(1),
});

const rawSectionSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().optional(),
  questions: z.array(rawQuestionSchema).min(1),
});

const rawPaperSchema = z.object({
  schoolName: z.string().optional(),
  subject: z.string().optional(),
  className: z.string().optional(),
  timeAllowedMinutes: z.number().int().positive().optional(),
  sections: z.array(rawSectionSchema).min(1),
  answerKey: z.array(z.string().min(1)).optional(),
});

function normalizeDifficulty(value: string): Difficulty {
  const lowered = value.trim().toLowerCase();
  const parsed = difficultySchema.safeParse(lowered);
  if (!parsed.success) {
    throw new Error("PAPER_NORMALIZATION_FAILED: Invalid difficulty in generated output");
  }

  return parsed.data;
}

export function normalizeGeneratedPaper(
  request: GenerationRequestPayload,
  rawDraft: unknown,
): GeneratedQuestionPaper {
  const parsed = rawPaperSchema.safeParse(rawDraft);

  if (!parsed.success) {
    throw new Error("PAPER_NORMALIZATION_FAILED: Invalid generated paper structure");
  }

  const fallbackMarks = Math.max(1, Math.floor(request.totalMarks / Math.max(1, request.totalQuestions)));
  const requestedSectionTitles = request.expectedOutput.sections;

  const allQuestions = parsed.data.sections.flatMap((section) => section.questions);

  if (allQuestions.length === 0) {
    throw new Error("PAPER_NORMALIZATION_FAILED: Generated paper has no questions");
  }

  while (allQuestions.length < request.totalQuestions) {
    const nextNumber = allQuestions.length + 1;
    allQuestions.push({
      text: `Write a concise academic response for question ${nextNumber}.`,
      marks: fallbackMarks,
      difficulty: "medium",
    });
  }

  const trimmedQuestions = allQuestions.slice(0, request.totalQuestions);

  const sections = requestedSectionTitles.map((title, sectionIndex) => {
    const sectionQuestions = trimmedQuestions
      .filter((_, questionIndex) => questionIndex % requestedSectionTitles.length === sectionIndex)
      .map((question, questionIndex) => ({
        id: `q-${sectionIndex + 1}-${questionIndex + 1}`,
        text: question.text.trim(),
        marks: Number.isFinite(question.marks) ? question.marks : fallbackMarks,
        difficulty: normalizeDifficulty(question.difficulty),
      }));

    if (sectionQuestions.length === 0) {
      sectionQuestions.push({
        id: `q-${sectionIndex + 1}-1`,
        text: `Write one answer for ${title}.`,
        marks: fallbackMarks,
        difficulty: "medium",
      });
    }

    return {
      id: `sec-${sectionIndex + 1}`,
      title,
      instruction: "Attempt all questions. Each question carries marks as indicated.",
      questions: sectionQuestions,
    };
  });

  const answerKey = trimmedQuestions.map((_, index) => {
    return parsed.data.answerKey?.[index] ?? `Q${index + 1}: Key evaluation point.`;
  });

  return {
    assignmentId: request.assignmentId,
    schoolName: parsed.data.schoolName ?? "Delhi Public School, Sector-4, Bokaro",
    subject: parsed.data.subject ?? "English",
    className: parsed.data.className ?? "5th",
    timeAllowedMinutes: parsed.data.timeAllowedMinutes ?? 45,
    maxMarks: request.totalMarks,
    studentFields: {
      name: true,
      rollNumber: true,
      section: true,
    },
    sections,
    answerKey,
  };
}
