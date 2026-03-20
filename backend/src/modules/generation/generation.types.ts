export type GenerationStatus = "queued" | "processing" | "completed" | "failed";

export type Difficulty = "easy" | "medium" | "hard";

export type PaperQuestion = {
  id: string;
  text: string;
  marks: number;
  difficulty: Difficulty;
};

export type PaperSection = {
  id: string;
  title: string;
  instruction?: string;
  questions: PaperQuestion[];
};

export type GeneratedQuestionPaper = {
  assignmentId: string;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowedMinutes: number;
  maxMarks: number;
  studentFields: {
    name: boolean;
    rollNumber: boolean;
    section: boolean;
  };
  sections: PaperSection[];
  answerKey?: string[];
};

export type GenerationRequestPayload = {
  userId: string;
  assignmentId: string;
  dueDate: string;
  questionTypes: Array<{
    type: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
    totalMarks: number;
  }>;
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  sourceFileAttached: boolean;
  sourceMaterialText?: string;
  sourceFileName?: string;
  profile?: {
    userName?: string;
    schoolName?: string;
    schoolLocation?: string;
    schoolIconUrl?: string;
    teacherSubject?: string;
    className?: string;
    subject?: string;
    timeAllowedMinutes?: number;
  };
  expectedOutput: {
    sections: string[];
    includeDifficulty: boolean;
    includeMarks: boolean;
  };
};

export type GenerationJob = {
  jobId: string;
  userId: string;
  assignmentId: string;
  status: GenerationStatus;
  progress: number;
  message: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
};

export type GenerationSocketEvent =
  | "generation:queued"
  | "generation:processing"
  | "generation:completed"
  | "generation:failed";