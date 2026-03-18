import type { PaperSection } from "@/types/question-paper";
import { DifficultyBadge } from "@/components/output/difficulty-badge";

type QuestionSectionBlockProps = {
  section: PaperSection;
};

export function QuestionSectionBlock({ section }: QuestionSectionBlockProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
      {section.instruction ? <p className="text-sm italic text-gray-600">{section.instruction}</p> : null}

      <ol className="space-y-3">
        {section.questions.map((question, index) => (
          <li key={question.id} className="rounded-lg border border-gray-200 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-900">Q{index + 1}</p>
              <DifficultyBadge difficulty={question.difficulty} />
            </div>
            <p className="text-sm text-gray-700">{question.text}</p>
            <p className="mt-2 text-xs font-medium text-gray-600">[{question.marks} Marks]</p>
          </li>
        ))}
      </ol>
    </section>
  );
}