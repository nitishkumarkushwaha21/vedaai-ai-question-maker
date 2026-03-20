/*
 * Called by exam paper sheet to render one section of questions.
 * Calls only local display formatting for numbering and marks.
 * This file keeps section content in printable exam-style text blocks.
 */
import type { PaperSection } from "@/types/question-paper";

type QuestionSectionBlockProps = {
  section: PaperSection;
};

export function QuestionSectionBlock({ section }: QuestionSectionBlockProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-center text-base font-semibold text-slate-900 md:text-[22px]">{section.title}</h3>
      {section.instruction ? <p className="text-[11px] italic text-slate-600 md:text-sm">{section.instruction}</p> : null}

      <ol className="space-y-2 pl-4 text-[11px] leading-relaxed text-slate-800 md:text-sm">
        {section.questions.map((question, index) => (
          <li key={question.id} className="leading-relaxed">
            <span className="font-medium">{index + 1}. </span>
            <span className="font-medium">[{question.difficulty[0]?.toUpperCase()}{question.difficulty.slice(1)}]</span>{" "}
            {question.text} <span className="font-medium">[{question.marks} Marks]</span>
          </li>
        ))}
      </ol>
    </section>
  );
}