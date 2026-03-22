/*
 * Called by exam paper sheet to render one section of questions.
 * Calls only local display formatting for numbering and marks.
 * This file keeps section content in printable exam-style text blocks.
 */
import type { PaperSection } from "@/types/question-paper";
import { DifficultyBadge } from "@/components/output/difficulty-badge";

type QuestionSectionBlockProps = {
  section: PaperSection;
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

export function QuestionSectionBlock({ section }: QuestionSectionBlockProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-center text-base font-semibold text-slate-900 md:text-[22px]">{section.title}</h3>
      {section.instruction ? <p className="text-[11px] italic text-slate-600 md:text-sm">{section.instruction}</p> : null}

      <ol className="space-y-2 pl-4 text-[11px] leading-relaxed text-slate-800 md:text-sm">
        {section.questions.map((question, index) => {
          const mcq = splitMcqQuestion(question.text);

          return (
            <li key={question.id} className="space-y-1.5 leading-relaxed">
              {mcq ? (
                <>
                  <p>
                    <span className="font-medium">{index + 1}. </span>
                    <span className="mr-1.5 inline-flex align-middle"><DifficultyBadge difficulty={question.difficulty} /></span>
                    {mcq.stem} <span className="font-medium">[{question.marks} Marks]</span>
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-medium md:grid-cols-4 md:text-sm">
                    {mcq.options.map((option) => (
                      <span key={`${question.id}-${option}`} className="whitespace-nowrap">
                        {option}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="whitespace-pre-line">
                  <span className="font-medium">{index + 1}. </span>
                  <span className="mr-1.5 inline-flex align-middle"><DifficultyBadge difficulty={question.difficulty} /></span>
                  {question.text} <span className="font-medium">[{question.marks} Marks]</span>
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}