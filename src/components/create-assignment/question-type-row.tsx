"use client";

import type { UseFormRegister } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/modules/assignments/schema";
import { QUESTION_TYPE_OPTIONS } from "@/modules/assignments/schema";

type QuestionTypeRowProps = {
  index: number;
  register: UseFormRegister<CreateAssignmentFormValues>;
  onRemove: () => void;
};

export function QuestionTypeRow({ index, register, onRemove }: QuestionTypeRowProps) {
  return (
    <div className="grid gap-2 rounded-xl bg-gray-50 p-3 md:grid-cols-12">
      <select
        className="md:col-span-7 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        {...register(`questionRows.${index}.type`)}
      >
        {QUESTION_TYPE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={1}
        className="md:col-span-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        {...register(`questionRows.${index}.numberOfQuestions`, { valueAsNumber: true })}
      />

      <input
        type="number"
        min={1}
        className="md:col-span-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        {...register(`questionRows.${index}.marksPerQuestion`, { valueAsNumber: true })}
      />

      <button
        type="button"
        onClick={onRemove}
        className="md:col-span-1 rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm text-gray-600"
      >
        x
      </button>
    </div>
  );
}