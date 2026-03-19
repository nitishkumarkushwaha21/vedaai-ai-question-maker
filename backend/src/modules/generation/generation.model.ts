import { Schema, model } from "mongoose";
import type { GenerationStatus } from "./generation.types";

const questionSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    marks: { type: Number, required: true },
    difficulty: { type: String, required: true },
  },
  { _id: false },
);

const sectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [questionSchema], default: [] },
  },
  { _id: false },
);

const generatedPaperSchema = new Schema(
  {
    assignmentId: { type: String, required: true },
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    timeAllowedMinutes: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    studentFields: {
      name: { type: Boolean, required: true },
      rollNumber: { type: Boolean, required: true },
      section: { type: Boolean, required: true },
    },
    sections: { type: [sectionSchema], default: [] },
    answerKey: { type: [String], default: [] },
  },
  { _id: false },
);

const generationRecordSchema = new Schema(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    assignmentId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"] satisfies GenerationStatus[],
      required: true,
    },
    progress: { type: Number, required: true },
    message: { type: String, required: true },
    startedAt: { type: String, required: true },
    completedAt: { type: String },
    error: { type: String },
    request: { type: Schema.Types.Mixed, required: true },
    generatedPaper: { type: generatedPaperSchema },
  },
  { timestamps: true },
);

export const GenerationRecordModel = model("GenerationRecord", generationRecordSchema);