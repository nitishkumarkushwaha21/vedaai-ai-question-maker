import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Difficulty, PaperSection, QuestionPaper } from "@/types/question-paper";

export type PdfDifficultyDisplayMode = "none" | "text" | "color";

type QuestionPaperPdfDocumentProps = {
  paper: QuestionPaper;
  difficultyDisplayMode?: PdfDifficultyDisplayMode;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 32,
    fontSize: 11,
    color: "#111827",
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 2,
    fontWeight: "bold",
  },
  metaRow: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  note: {
    marginBottom: 10,
  },
  studentInfo: {
    marginBottom: 14,
    gap: 3,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionInstruction: {
    fontStyle: "italic",
    marginBottom: 6,
    color: "#374151",
  },
  questionWrap: {
    marginBottom: 6,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  questionMain: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  questionText: {
    flexShrink: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  marks: {
    width: 78,
    textAlign: "right",
    fontWeight: "bold",
  },
  optionsRow: {
    marginTop: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    minWidth: 120,
  },
  difficultyText: {
    color: "#1f2937",
    fontSize: 10,
    marginTop: 1,
  },
  difficultyChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 9,
    color: "#111827",
    marginTop: 1,
  },
  endText: {
    marginTop: 4,
    fontWeight: "bold",
  },
  answerKey: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    paddingTop: 6,
  },
  answerKeyTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  answerLine: {
    marginBottom: 2,
  },
});

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

function difficultyLabel(difficulty: Difficulty) {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

function difficultyChipStyle(difficulty: Difficulty) {
  if (difficulty === "easy") {
    return { backgroundColor: "#d1fae5", borderColor: "#a7f3d0" };
  }
  if (difficulty === "medium") {
    return { backgroundColor: "#fef3c7", borderColor: "#fde68a" };
  }
  return { backgroundColor: "#ffe4e6", borderColor: "#fecdd3" };
}

function DifficultyPart({ difficulty, mode }: { difficulty: Difficulty; mode: PdfDifficultyDisplayMode }) {
  if (mode === "none") {
    return null;
  }

  if (mode === "text") {
    return <Text style={styles.difficultyText}>({difficultyLabel(difficulty)})</Text>;
  }

  return <Text style={[styles.difficultyChip, difficultyChipStyle(difficulty)]}>{difficultyLabel(difficulty)}</Text>;
}

function SectionBlock({ section, difficultyDisplayMode }: { section: PaperSection; difficultyDisplayMode: PdfDifficultyDisplayMode }) {
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.instruction ? <Text style={styles.sectionInstruction}>{section.instruction}</Text> : null}

      {section.questions.map((question, index) => {
        const mcq = splitMcqQuestion(question.text);
        const questionLabel = `Q${index + 1}.`;
        const normalizedText = normalizeQuestionText(mcq ? mcq.stem : question.text);

        return (
          <View key={question.id} style={styles.questionWrap}>
            <View style={styles.questionRow}>
              <View style={styles.questionMain}>
                <Text style={styles.questionText}>
                  <Text style={styles.bold}>{questionLabel} </Text>
                  {normalizedText}
                </Text>
                <DifficultyPart difficulty={question.difficulty} mode={difficultyDisplayMode} />
              </View>
              <Text style={styles.marks}>[{question.marks} marks]</Text>
            </View>

            {mcq ? (
              <View style={styles.optionsRow}>
                {mcq.options.map((option) => (
                  <Text key={`${question.id}-${option}`} style={styles.option}>
                    {option}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export function QuestionPaperPdfDocument({ paper, difficultyDisplayMode = "color" }: QuestionPaperPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{paper.schoolName}</Text>
        <Text style={styles.subtitle}>Subject: {paper.subject}</Text>
        <Text style={styles.subtitle}>Class: {paper.className}</Text>

        <View style={styles.metaRow}>
          <Text>Time Allowed: {paper.timeAllowedMinutes} minutes</Text>
          <Text>Maximum Marks: {paper.maxMarks}</Text>
        </View>

        <Text style={styles.note}>All questions are compulsory unless stated otherwise.</Text>

        <View style={styles.studentInfo}>
          <Text>Name: ____________</Text>
          <Text>Roll Number: ____________</Text>
          <Text>Class: {paper.className}   Section: ____________</Text>
        </View>

        {paper.sections.map((section) => (
          <SectionBlock key={section.id} section={section} difficultyDisplayMode={difficultyDisplayMode} />
        ))}

        <Text style={styles.endText}>End of Question Paper</Text>

        {paper.answerKey?.length ? (
          <View style={styles.answerKey}>
            <Text style={styles.answerKeyTitle}>Answer Key:</Text>
            {paper.answerKey.map((line, index) => (
              <Text key={`${line}-${index}`} style={styles.answerLine}>
                {index + 1}. {line}
              </Text>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}