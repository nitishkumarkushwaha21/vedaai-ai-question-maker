import type { QuestionPaper } from "@/types/question-paper";
import { QuestionSectionBlock } from "@/components/output/question-section-block";

type ExamPaperSheetProps = {
  paper: QuestionPaper;
};

export function ExamPaperSheet({ paper }: ExamPaperSheetProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm md:p-8">
      <header className="mb-6 space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">{paper.schoolName}</h2>
        <p className="text-gray-700">Subject: {paper.subject}</p>
        <p className="text-gray-700">Class: {paper.className}</p>
      </header>

      <div className="mb-4 flex items-center justify-between text-sm text-gray-700">
        <p>Time Allowed: {paper.timeAllowedMinutes} minutes</p>
        <p>Maximum Marks: {paper.maxMarks}</p>
      </div>

      <div className="mb-6 space-y-1 text-sm text-gray-800">
        <p>Name: ____________</p>
        <p>Roll Number: ____________</p>
        <p>Class: {paper.className} Section: ____________</p>
      </div>

      <div className="space-y-8">
        {paper.sections.map((section) => (
          <QuestionSectionBlock key={section.id} section={section} />
        ))}
      </div>

      {paper.answerKey?.length ? (
        <section className="mt-8 border-t border-gray-200 pt-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Answer Key</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-700">
            {paper.answerKey.map((line, index) => (
              <li key={`${line}-${index}`}>{line}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </article>
  );
}