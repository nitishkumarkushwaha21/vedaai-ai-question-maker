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
  // Some adapters may emit empty sections when total questions < section count.
  // We allow that here and rebalance/fill questions in normalization below.
  questions: z.array(rawQuestionSchema),
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

  const baseSections = requestedSectionTitles.map((title, sectionIndex) => {
    const parsedSection = parsed.data.sections[sectionIndex];
    const questions = (parsedSection?.questions ?? []).map((question, questionIndex) => ({
      id: `q-${sectionIndex + 1}-${questionIndex + 1}`,
      text: question.text.trim(),
      marks: Number.isFinite(question.marks) ? question.marks : fallbackMarks,
      difficulty: normalizeDifficulty(question.difficulty),
    }));

    return {
      id: `sec-${sectionIndex + 1}`,
      title,
      instruction: "Attempt all questions. Each question carries marks as indicated.",
      questions,
    };
  });

  // If provider returns extra sections, append their questions to the last requested section
  // rather than rebalancing everything and breaking grouping semantics.
  if (parsed.data.sections.length > baseSections.length && baseSections.length > 0) {
    const lastSection = baseSections[baseSections.length - 1];
    for (let index = baseSections.length; index < parsed.data.sections.length; index += 1) {
      const extraSection = parsed.data.sections[index];
      for (const question of extraSection.questions) {
        lastSection.questions.push({
          id: `q-${baseSections.length}-${lastSection.questions.length + 1}`,
          text: question.text.trim(),
          marks: Number.isFinite(question.marks) ? question.marks : fallbackMarks,
          difficulty: normalizeDifficulty(question.difficulty),
        });
      }
    }
  }

  const allQuestions = baseSections.flatMap((section) => section.questions);

  if (allQuestions.length === 0) {
    throw new Error("PAPER_NORMALIZATION_FAILED: Generated paper has no questions");
  }

  while (allQuestions.length < request.totalQuestions && baseSections.length > 0) {
    const nextNumber = allQuestions.length + 1;
    const lastSection = baseSections[baseSections.length - 1];
    const fallbackQuestion = {
      id: `q-${baseSections.length}-${lastSection.questions.length + 1}`,
      text: `Write a concise academic response for question ${nextNumber}.`,
      marks: fallbackMarks,
      difficulty: normalizeDifficulty("medium"),
    };

    lastSection.questions.push(fallbackQuestion);
    allQuestions.push(fallbackQuestion);
  }

  let overflowCount = allQuestions.length - request.totalQuestions;
  if (overflowCount > 0) {
    for (let sectionIndex = baseSections.length - 1; sectionIndex >= 0 && overflowCount > 0; sectionIndex -= 1) {
      const currentQuestions = baseSections[sectionIndex].questions;
      while (currentQuestions.length > 0 && overflowCount > 0) {
        currentQuestions.pop();
        overflowCount -= 1;
      }
    }
  }

  const finalQuestions = baseSections.flatMap((section) => section.questions).slice(0, request.totalQuestions);

  const answerKey = finalQuestions.map((_, index) => {
    return parsed.data.answerKey?.[index] ?? `Q${index + 1}: Key evaluation point.`;
  });

  return {
    assignmentId: request.assignmentId,
    schoolName: request.profile?.schoolName || parsed.data.schoolName || "Delhi Public School, Sector-4, Bokaro",
    subject: request.profile?.subject || request.profile?.teacherSubject || parsed.data.subject || "English",
    className: request.profile?.className || parsed.data.className || "5th",
    timeAllowedMinutes: request.profile?.timeAllowedMinutes ?? parsed.data.timeAllowedMinutes ?? 45,
    maxMarks: request.totalMarks,
    studentFields: {
      name: true,
      rollNumber: true,
      section: true,
    },
    sections: baseSections,
    answerKey,
  };
}
