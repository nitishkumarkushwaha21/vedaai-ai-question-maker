/*
 * Called by the generation pipeline to create a provider-agnostic paper draft.
 * Calls OpenRouter provider when configured and falls back to deterministic mock data.
 * This file is the adapter boundary for AI-provider-specific integration.
 */
import { ENV } from "../../config/env";
import { logError, logInfo } from "../../utils/logger";
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

type OpenRouterChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
    finish_reason?: string;
  }>;
};

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

function stripCodeFence(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("```") || !trimmed.endsWith("```")) {
    return trimmed;
  }

  const withoutStart = trimmed.replace(/^```(?:json)?\s*/i, "");
  return withoutStart.replace(/\s*```$/, "").trim();
}

function parseJsonObjectFromText(text: string): unknown {
  const normalized = stripCodeFence(text);

  try {
    return JSON.parse(normalized);
  } catch {
    const start = normalized.indexOf("{");
    const end = normalized.lastIndexOf("}");
    if (start < 0 || end <= start) {
      throw new Error("OPENROUTER_OUTPUT_PARSE_FAILED: No JSON object found in model response");
    }

    const candidate = normalized.slice(start, end + 1);
    return JSON.parse(candidate);
  }
}

function buildPrompt(request: GenerationRequestPayload) {
  const questionTypeLines = request.questionTypes
    .map((item, index) => {
      return `${index + 1}. type=${item.type}; count=${item.numberOfQuestions}; marksPerQuestion=${item.marksPerQuestion}; totalMarks=${item.totalMarks}`;
    })
    .join("\n");

  const sectionList = request.expectedOutput.sections.join(", ");
  const includeDifficulty = request.expectedOutput.includeDifficulty ? "true" : "false";
  const includeMarks = request.expectedOutput.includeMarks ? "true" : "false";
  const sourceExcerpt = request.sourceMaterialText
    ? request.sourceMaterialText.slice(0, 8000)
    : "";
  const fileContext = request.sourceFileAttached
    ? "User attached source material. You must ground questions in provided source text and instructions."
    : "No source file was attached.";
  const profileContext = request.profile
    ? `userName=${request.profile.userName ?? "n/a"}; schoolName=${request.profile.schoolName ?? "n/a"}; teacherSubject=${request.profile.teacherSubject ?? "n/a"}; className=${request.profile.className ?? "n/a"}; subject=${request.profile.subject ?? "n/a"}`
    : "no profile context";

  return [
    "You are an exam paper generator. Return STRICT JSON only with no markdown or explanation.",
    "The output schema must be:",
    "{",
    '  "schoolName": "string",',
    '  "subject": "string",',
    '  "className": "string",',
    '  "timeAllowedMinutes": number,',
    '  "sections": [',
    "    {",
    '      "title": "string",',
    '      "instruction": "string",',
    '      "questions": [',
    "        {",
    '          "text": "string",',
    '          "marks": number,',
    '          "difficulty": "easy|medium|hard"',
    "        }",
    "      ]",
    "    }",
    "  ],",
    '  "answerKey": ["string"]',
    "}",
    "",
    "Generation constraints:",
    `- assignmentId: ${request.assignmentId}`,
    `- dueDate: ${request.dueDate}`,
    `- totalQuestions: ${request.totalQuestions}`,
    `- totalMarks: ${request.totalMarks}`,
    `- requiredSections: ${sectionList}`,
    `- includeDifficulty: ${includeDifficulty}`,
    `- includeMarks: ${includeMarks}`,
    `- additionalInstructions: ${request.additionalInstructions ?? "none"}`,
    `- sourceFileAttached: ${request.sourceFileAttached ? "true" : "false"}`,
    `- sourceFileName: ${request.sourceFileName ?? "none"}`,
    `- sourceContext: ${fileContext}`,
    `- profileContext: ${profileContext}`,
    "- Ensure generated questions are clear and syllabus-aligned.",
    "- Ensure marks and difficulty are realistic.",
    "- Keep answerKey length aligned to totalQuestions.",
    sourceExcerpt ? "- Primary source text (use this as core context):" : "",
    sourceExcerpt,
    "",
    "Question type requirements:",
    questionTypeLines,
  ].join("\n");
}

export class OpenRouterGenerationAiAdapter implements GenerationAiAdapter {
  constructor(private readonly apiKey: string, private readonly model: string = "openai/gpt-4o-mini") {
  }

  private async callOpenRouter(model: string, prompt: string, signal: AbortSignal): Promise<OpenRouterChatResponse> {
    const endpoint = "https://openrouter.ai/api/v1/chat/completions";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Veda AI Assessment Creator",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You generate exam papers. Return strict JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      }),
      signal,
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      throw new Error(`OPENROUTER_API_FAILED: HTTP ${response.status} ${bodyText}`);
    }

    return (await response.json()) as OpenRouterChatResponse;
  }

  async generatePaperDraft(request: GenerationRequestPayload): Promise<unknown> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const prompt = buildPrompt(request);
      const modelCandidates = [
        this.model,
        "openai/gpt-4o-mini",
        "meta-llama/llama-3.1-8b-instruct:free",
      ].filter((value, index, arr) => arr.indexOf(value) === index);

      let payload: OpenRouterChatResponse | null = null;
      let lastError: Error | null = null;

      for (const modelCandidate of modelCandidates) {
        try {
          payload = await this.callOpenRouter(modelCandidate, prompt, controller.signal);
          break;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          lastError = error instanceof Error ? error : new Error(message);
          const isModelNotFound = message.includes("HTTP 404");

          if (!isModelNotFound) {
            throw lastError;
          }

          logInfo("openrouter_model_fallback_attempt", {
            assignmentId: request.assignmentId,
            failedModel: modelCandidate,
          });
        }
      }

      if (!payload) {
        throw (lastError ?? new Error("OPENROUTER_API_FAILED: No response payload"));
      }

      const responseText = payload.choices?.[0]?.message?.content?.trim();
      if (!responseText) {
        throw new Error("OPENROUTER_OUTPUT_EMPTY: Model returned empty content");
      }

      const parsed = parseJsonObjectFromText(responseText);
      logInfo("openrouter_generation_success", {
        assignmentId: request.assignmentId,
        finishReason: payload.choices?.[0]?.finish_reason,
      });
      return parsed;
    } catch (error) {
      logError("openrouter_generation_failed", {
        assignmentId: request.assignmentId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export function createGenerationAiAdapter(): GenerationAiAdapter {
  if (!ENV.OPENROUTER_API_KEY.trim()) {
    logInfo("generation_adapter_selected", { provider: "mock", reason: "missing_openrouter_api_key" });
    return new MockGenerationAiAdapter();
  }

  logInfo("generation_adapter_selected", { provider: "openrouter", model: ENV.OPENROUTER_MODEL });
  return new OpenRouterGenerationAiAdapter(ENV.OPENROUTER_API_KEY, ENV.OPENROUTER_MODEL);
}
