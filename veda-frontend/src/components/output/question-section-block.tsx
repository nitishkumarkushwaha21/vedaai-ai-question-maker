/*
 * Called by exam paper sheet to render one section of questions.
 * Calls only local display formatting for numbering and marks.
 * This file keeps section content in printable exam-style text blocks.
 */
import type { PaperSection } from "@/types/question-paper";
import { DifficultyBadge } from "@/components/output/difficulty-badge";

export type DifficultyDisplayMode = "none" | "text" | "color";

type QuestionSectionBlockProps = {
  section: PaperSection;
  difficultyDisplayMode?: DifficultyDisplayMode;
};

function splitMcqQuestion(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return null;
  }

  const stem = lines[0];
  const optionLines = lines.slice(1).filter((line) => /^[A-D]\)/i.test(line));

  if (optionLines.length < 4) {
    return null;
  }

  return {
    stem,
    options: optionLines.slice(0, 4),
  };
}

function stripLeadingQuestionLabel(text: string) {
  return text.replace(/^\s*(?:Q\s*\d+|\d+)\s*[\.)-:]?\s*/i, "").trim();
}

function normalizeQuestionText(text: string) {
  const withoutQuestionLabel = stripLeadingQuestionLabel(text);
  const withoutDifficultyPrefix = withoutQuestionLabel.replace(/^\s*\[?\s*(easy|medium|hard)\s*\]?\s*[:\-]?\s*/i, "");
  return withoutDifficultyPrefix.replace(/\s+/g, " ").trim();
}

export function QuestionSectionBlock({ section, difficultyDisplayMode = "color" }: QuestionSectionBlockProps) {
  const renderDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    if (difficultyDisplayMode === "none") {
      return null;
    }

    if (difficultyDisplayMode === "text") {
      return <DifficultyBadge difficulty={difficulty} variant="text" />;
    }

    return <DifficultyBadge difficulty={difficulty} variant="color" />;
  };

  return (
    <section className="paper-section space-y-3">
      <h3 className="text-center text-base font-semibold text-slate-900 md:text-[22px]">{section.title}</h3>
      {section.instruction ? <p className="text-[11px] italic text-slate-600 md:text-sm">{section.instruction}</p> : null}

      <ol className="list-none space-y-2 pl-0 text-[11px] leading-relaxed text-slate-800 md:text-sm">
        {section.questions.map((question, index) => {
          const mcq = splitMcqQuestion(question.text);
          const questionLabel = `Q${index + 1}.`;

          return (
            <li key={question.id} className="space-y-1.5 leading-relaxed">
              {mcq ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1">
                      <span className="font-medium">{questionLabel} </span>
                      {normalizeQuestionText(mcq.stem)}
                      {difficultyDisplayMode !== "none" ? (
                        <span className="ml-2 inline-flex align-middle">{renderDifficulty(question.difficulty)}</span>
                      ) : null}
                    </p>
                    <span className="marks-col shrink-0 text-right font-medium">[{question.marks} marks]</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-medium md:grid-cols-4 md:text-sm">
                    {mcq.options.map((option) => (
                      <span key={`${question.id}-${option}`} className="whitespace-nowrap">
                        {option}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 flex-1">
                    <span className="font-medium">{questionLabel} </span>
                    {normalizeQuestionText(question.text)}
                    {difficultyDisplayMode !== "none" ? (
                      <span className="ml-2 inline-flex align-middle">{renderDifficulty(question.difficulty)}</span>
                    ) : null}
                  </p>
                  <span className="marks-col shrink-0 text-right font-medium">[{question.marks} marks]</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}