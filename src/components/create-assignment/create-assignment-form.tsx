"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAssignmentSchema,
  type CreateAssignmentFormValues,
  QUESTION_TYPE_OPTIONS,
} from "@/modules/assignments/schema";
import { FileUploadField } from "@/components/create-assignment/file-upload-field";
import { QuestionTypeRow } from "@/components/create-assignment/question-type-row";

export function CreateAssignmentForm() {
  const form = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      dueDate: "",
      questionRows: [
        {
          type: QUESTION_TYPE_OPTIONS[0],
          numberOfQuestions: 1,
          marksPerQuestion: 1,
        },
      ],
      additionalInstructions: "",
    },
  });

  const { control, register, handleSubmit, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questionRows",
  });

  const questionRows = watch("questionRows");

  const totals = useMemo(() => {
    const totalQuestions = questionRows.reduce((sum, row) => sum + (row.numberOfQuestions || 0), 0);
    const totalMarks = questionRows.reduce(
      (sum, row) => sum + (row.numberOfQuestions || 0) * (row.marksPerQuestion || 0),
      0,
    );
    return { totalQuestions, totalMarks };
  }, [questionRows]);

  const onSubmit = (values: CreateAssignmentFormValues) => {
    console.log("Create assignment payload:", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl bg-white p-4 md:p-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Assignment Details</h2>
        <p className="text-sm text-gray-500">Basic information about your assignment</p>
      </div>

      <FileUploadField control={control} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          {...register("dueDate")}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Question Type</label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <QuestionTypeRow
              key={field.id}
              index={index}
              register={register}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              type: QUESTION_TYPE_OPTIONS[0],
              numberOfQuestions: 1,
              marksPerQuestion: 1,
            })
          }
          className="inline-flex rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          + Add Question Type
        </button>
      </div>

      <div className="text-right text-sm text-gray-700">
        <p>Total Questions: {totals.totalQuestions}</p>
        <p>Total Marks: {totals.totalMarks}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Additional Information (For better output)</label>
        <textarea
          rows={4}
          placeholder="e.g. Generate a question paper for 1 hour exam duration..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          {...register("additionalInstructions")}
        />
      </div>

      <div className="flex items-center justify-between">
        <button type="button" className="rounded-full border border-gray-200 px-4 py-2 text-sm">
          Previous
        </button>
        <button type="submit" className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white">
          Next
        </button>
      </div>
    </form>
  );
}