import { createElement } from "react";
import { pdf } from "@react-pdf/renderer";
import { QuestionPaperPdfDocument, type PdfDifficultyDisplayMode } from "@/components/output/question-paper-pdf-document";
import type { QuestionPaper } from "@/types/question-paper";

type DownloadPdfOptions = {
  paper: QuestionPaper;
  fileName: string;
  difficultyDisplayMode?: PdfDifficultyDisplayMode;
};

export async function downloadQuestionPaperPdf({ paper, fileName, difficultyDisplayMode = "color" }: DownloadPdfOptions) {
  const doc = createElement(QuestionPaperPdfDocument, { paper, difficultyDisplayMode });
  const blob = await pdf(doc as never).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}