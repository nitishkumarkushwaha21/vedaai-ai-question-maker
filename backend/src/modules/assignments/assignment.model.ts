import { Schema, model } from "mongoose";

const questionTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true },
    marksPerQuestion: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
  },
  { _id: false },
);

const assignmentSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    assignmentId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    dueDate: { type: String, required: true },
    questionTypes: { type: [questionTypeSchema], default: [] },
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    additionalInstructions: { type: String },
    sourceFileAttached: { type: Boolean, required: true },
  },
  { timestamps: true },
);

assignmentSchema.index({ userId: 1, assignmentId: 1 }, { unique: true });

export const AssignmentModel = model("Assignment", assignmentSchema);
