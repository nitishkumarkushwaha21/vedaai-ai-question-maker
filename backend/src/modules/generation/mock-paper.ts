/*
 * Called by generation worker to produce the final question paper object.
 * Calls AI adapter for draft generation and then strict normalization.
 * This file is the single orchestrator for paper creation in worker flow.
 */
import { createGenerationAiAdapter } from "./ai-adapter";
import { normalizeGeneratedPaper } from "./paper-normalizer";
import type { GeneratedQuestionPaper, GenerationRequestPayload } from "./generation.types";

const adapter = createGenerationAiAdapter();

export async function buildMockPaper(request: GenerationRequestPayload): Promise<GeneratedQuestionPaper> {
  const generatedDraft = await adapter.generatePaperDraft(request);
  return normalizeGeneratedPaper(request, generatedDraft);
}