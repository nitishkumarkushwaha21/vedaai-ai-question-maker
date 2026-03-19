/*
 * Called by the generation pipeline to create a provider-agnostic paper draft.
 * Calls only deterministic mock logic for now, so worker behavior is stable.
 * This file is the adapter boundary where a real LLM provider can be plugged in later.
 */
import type { GenerationRequestPayload } from "./generation.types";

type GeneratedQuestionDraft = {
  text: string;
  marks: number;
  difficulty: string;
};

type GeneratedSectionDraft = {
  title: string;
  instruction?: string;
  questions: GeneratedQuestionDraft[];
};

type GeneratedPaperDraft = {
  schoolName?: string;
  subject?: string;
  className?: string;
  timeAllowedMinutes?: number;
  sections: GeneratedSectionDraft[];
  answerKey?: string[];
};

export interface GenerationAiAdapter {
  generatePaperDraft(request: GenerationRequestPayload): Promise<unknown>;
}

function difficultyByIndex(index: number): string {
  const sequence = ["easy", "medium", "hard"] as const;
  return sequence[index % sequence.length];
}

function buildQuestionText(questionType: string, sequenceNo: number): string {
  const normalized = questionType.trim().toLowerCase();

  if (normalized.includes("mcq") || normalized.includes("multiple")) {
    return `Write the correct option for question ${sequenceNo} based on the chapter concept.`;
  }

  if (normalized.includes("long")) {
    return `Explain question ${sequenceNo} with key points and one practical example.`;
  }

  if (normalized.includes("very short")) {
    return `Answer question ${sequenceNo} in one or two lines.`;
  }

  return `Define and explain concept ${sequenceNo} in clear academic language.`;
}

export class MockGenerationAiAdapter implements GenerationAiAdapter {
  async generatePaperDraft(request: GenerationRequestPayload): Promise<unknown> {
    const requestedSections = request.expectedOutput.sections;
    const sectionDrafts: GeneratedSectionDraft[] = requestedSections.map((sectionTitle) => ({
      title: sectionTitle,
      instruction: "Attempt all questions. Each question carries the marks shown.",
      questions: [],
    }));

    let globalQuestionIndex = 0;

    for (const questionType of request.questionTypes) {
      for (let idx = 0; idx < questionType.numberOfQuestions; idx += 1) {
        const sectionIndex = globalQuestionIndex % Math.max(1, sectionDrafts.length);

        sectionDrafts[sectionIndex]?.questions.push({
          text: buildQuestionText(questionType.type, globalQuestionIndex + 1),
          marks: questionType.marksPerQuestion,
          difficulty: difficultyByIndex(globalQuestionIndex),
        });

        globalQuestionIndex += 1;
      }
    }

    const answerKey = Array.from({ length: Math.max(1, globalQuestionIndex) }).map((_, index) => {
      return `Q${index + 1}: Model answer point for evaluation reference.`;
    });

    const draft: GeneratedPaperDraft = {
      schoolName: "Delhi Public School, Sector-4, Bokaro",
      subject: "English",
      className: "5th",
      timeAllowedMinutes: 45,
      sections: sectionDrafts,
      answerKey,
    };

    return draft;
  }
}
