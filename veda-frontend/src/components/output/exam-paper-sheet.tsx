/*
 * Called by the live toolkit output view after generation completes.
 * Calls section renderer for each generated section block.
 * This file renders the printable exam sheet layout.
 */
import type { QuestionPaper } from "@/types/question-paper";
import { QuestionSectionBlock } from "@/components/output/question-section-block";

type ExamPaperSheetProps = {
  paper: QuestionPaper;
};

export function ExamPaperSheet({ paper }: ExamPaperSheetProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <header className="mb-6 space-y-1 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{paper.schoolName}</h2>
        <p className="text-base font-semibold text-slate-700">Subject: {paper.subject}</p>
        <p className="text-base font-semibold text-slate-700">Class: {paper.className}</p>
      </header>

      <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-700 md:text-sm">
        <p>Time Allowed: {paper.timeAllowedMinutes} minutes</p>
        <p>Maximum Marks: {paper.maxMarks}</p>
      </div>

      <p className="mb-4 text-xs italic text-slate-600 md:text-sm">All questions are compulsory unless stated otherwise.</p>

      <div className="mb-8 space-y-1 text-xs text-slate-800 md:text-sm">
        <p>Name: ____________</p>
        <p>Roll Number: ____________</p>
        <p>Class: {paper.className} Section: ____________</p>
      </div>

      <div className="space-y-10">
        {paper.sections.map((section) => (
          <QuestionSectionBlock key={section.id} section={section} />
        ))}
      </div>

      <p className="mt-6 text-sm font-semibold text-slate-800">End of Question Paper</p>

      {paper.answerKey?.length ? (
        <section className="mt-8 border-t border-slate-200 pt-4">
          <h3 className="mb-2 text-base font-semibold text-slate-900 md:text-lg">Answer Key:</h3>
          <ol className="list-decimal space-y-1 pl-5 text-xs text-slate-700 md:text-sm">
            {paper.answerKey.map((line, index) => (
              <li key={`${line}-${index}`}>{line}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </article>
  );
}