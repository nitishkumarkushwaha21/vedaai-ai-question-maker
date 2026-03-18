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

export type QuestionPaper = {
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