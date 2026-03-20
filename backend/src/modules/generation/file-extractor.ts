import { PDFParse } from "pdf-parse";

export async function extractTextFromUploadedFile(file?: Express.Multer.File): Promise<string | undefined> {
  if (!file) {
    return undefined;
  }

  if (file.mimetype !== "application/pdf") {
    throw new Error("UNSUPPORTED_FILE_TYPE: Only PDF files are allowed");
  }

  const parser = new PDFParse({ data: file.buffer });
  let parsedText = "";

  try {
    const parsed = await parser.getText();
    parsedText = parsed.text ?? "";
  } finally {
    await parser.destroy().catch(() => {
      // Ignore parser cleanup errors for short-lived request scope.
    });
  }

  const normalized = parsedText.replace(/\s+/g, " ").trim();

  if (!normalized) {
    throw new Error("FILE_TEXT_EXTRACTION_FAILED: Could not extract readable text from PDF");
  }

  return normalized.slice(0, 12000);
}
