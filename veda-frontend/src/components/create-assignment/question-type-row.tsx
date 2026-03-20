"use client";

import type { UseFormRegister } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/modules/assignments/schema";
import { QUESTION_TYPE_OPTIONS } from "@/modules/assignments/schema";

type QuestionTypeRowProps = {
  index: number;
  register: UseFormRegister<CreateAssignmentFormValues>;
  numberOfQuestions: number;
  marksPerQuestion: number;
  onIncrementQuestions: () => void;
  onDecrementQuestions: () => void;
  onIncrementMarks: () => void;
  onDecrementMarks: () => void;
  rowErrors?: {
    type?: string;
    numberOfQuestions?: string;
    marksPerQuestion?: string;
  };
  onRemove: () => void;
};

export function QuestionTypeRow({
  index,
  register,
  numberOfQuestions,
  marksPerQuestion,
  onIncrementQuestions,
  onDecrementQuestions,
  onIncrementMarks,
  onDecrementMarks,
  rowErrors,
  onRemove,
}: QuestionTypeRowProps) {
  return (
    <div className="space-y-2 rounded-2xl bg-gray-50 p-3">
      <div className="grid gap-2 md:grid-cols-12">
        <div className="md:col-span-8">
          <select
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            {...register(`questionRows.${index}.type`)}
          >
            {QUESTION_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {rowErrors?.type ? <p className="mt-1 text-xs text-rose-600">{rowErrors.type}</p> : null}
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove question row ${index + 1}`}
          className="md:col-span-4 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-xl bg-white p-2">
          <p className="mb-2 text-[11px] font-medium text-gray-500">No. of Questions</p>
          <div className="flex items-center justify-between rounded-full border border-gray-200 px-2 py-1">
            <button
              type="button"
              onClick={onDecrementQuestions}
              aria-label={`Decrease number of questions for row ${index + 1}`}
              className="h-7 w-7 rounded-full text-gray-700 hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-sm font-semibold text-gray-800">{numberOfQuestions}</span>
            <button
              type="button"
              onClick={onIncrementQuestions}
              aria-label={`Increase number of questions for row ${index + 1}`}
              className="h-7 w-7 rounded-full text-gray-700 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          {rowErrors?.numberOfQuestions ? <p className="mt-1 text-xs text-rose-600">{rowErrors.numberOfQuestions}</p> : null}
        </div>

        <div className="rounded-xl bg-white p-2">
          <p className="mb-2 text-[11px] font-medium text-gray-500">Marks</p>
          <div className="flex items-center justify-between rounded-full border border-gray-200 px-2 py-1">
            <button
              type="button"
              onClick={onDecrementMarks}
              aria-label={`Decrease marks for row ${index + 1}`}
              className="h-7 w-7 rounded-full text-gray-700 hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-sm font-semibold text-gray-800">{marksPerQuestion}</span>
            <button
              type="button"
              onClick={onIncrementMarks}
              aria-label={`Increase marks for row ${index + 1}`}
              className="h-7 w-7 rounded-full text-gray-700 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          {rowErrors?.marksPerQuestion ? <p className="mt-1 text-xs text-rose-600">{rowErrors.marksPerQuestion}</p> : null}
        </div>
      </div>

      <input type="hidden" {...register(`questionRows.${index}.numberOfQuestions`, { valueAsNumber: true })} />
      <input type="hidden" {...register(`questionRows.${index}.marksPerQuestion`, { valueAsNumber: true })} />
    </div>
  );
}