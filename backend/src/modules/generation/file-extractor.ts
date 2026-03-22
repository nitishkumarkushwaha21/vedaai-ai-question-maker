import { PDFParse } from "pdf-parse";

export async function extractTextFromUploadedFile(file?: Express.Multer.File): Promise<string | undefined> {
  if (!file) {
    return undefined;
  }

  const mimetype = (file.mimetype || "").toLowerCase();
  const filename = (file.originalname || "").toLowerCase();
  const hasPdfHeader = file.buffer.subarray(0, 4).toString("ascii") === "%PDF";
  const isPdf = mimetype === "application/pdf" || filename.endsWith(".pdf") || hasPdfHeader;
  const isTxt = mimetype === "text/plain" || mimetype.startsWith("text/") || filename.endsWith(".txt");

  if (isTxt) {
    const text = file.buffer.toString("utf-8").replace(/\s+/g, " ").trim();
    if (!text) {
      throw new Error("FILE_TEXT_EXTRACTION_FAILED: Uploaded TXT file is empty");
    }

    return text.slice(0, 12000);
  }

  if (!isPdf) {
    throw new Error("UNSUPPORTED_FILE_TYPE: Only PDF or TXT files are allowed");
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
