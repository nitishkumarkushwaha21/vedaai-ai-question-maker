/*
 * Called by the live toolkit output view after generation completes.
 * Calls section renderer for each generated section block.
 * This file renders the printable exam sheet layout.
 */
import type { QuestionPaper } from "@/types/question-paper";
import { QuestionSectionBlock, type DifficultyDisplayMode } from "@/components/output/question-section-block";

type ExamPaperSheetProps = {
  paper: QuestionPaper;
  difficultyDisplayMode?: DifficultyDisplayMode;
};

export function ExamPaperSheet({ paper, difficultyDisplayMode = "color" }: ExamPaperSheetProps) {
  return (
    <article className="print-paper rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm md:px-6 md:py-8">
      <header className="mb-5 space-y-0.5 text-center">
        <h2 className="text-[26px] font-semibold tracking-tight text-slate-900 md:text-[38px]">{paper.schoolName}</h2>
        <p className="text-base font-semibold text-slate-700 md:text-[30px]">Subject: {paper.subject}</p>
        <p className="text-base font-semibold text-slate-700 md:text-[30px]">Class: {paper.className}</p>
      </header>

      <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-800 md:text-sm">
        <p>Time Allowed: {paper.timeAllowedMinutes} minutes</p>
        <p>Maximum Marks: {paper.maxMarks}</p>
      </div>

      <p className="mb-4 text-xs text-slate-700 md:text-sm">All questions are compulsory unless stated otherwise.</p>

      <div className="mb-6 space-y-1 text-xs text-slate-800 md:text-sm">
        <p>Name: ____________</p>
        <p>Roll Number: ____________</p>
        <p>Class: {paper.className} Section: ____________</p>
      </div>

      <div className="space-y-7">
        {paper.sections.map((section) => (
          <QuestionSectionBlock key={section.id} section={section} difficultyDisplayMode={difficultyDisplayMode} />
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800">End of Question Paper</p>

      {paper.answerKey?.length ? (
        <section className="mt-7 border-t border-slate-200 pt-4">
          <h3 className="mb-2 text-base font-semibold text-slate-900 md:text-lg">Answer Key:</h3>
          <ol className="list-decimal space-y-1 pl-5 text-[11px] leading-relaxed text-slate-700 md:text-sm">
            {paper.answerKey.map((line, index) => (
              <li key={`${line}-${index}`}>{line}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </article>
  );
}