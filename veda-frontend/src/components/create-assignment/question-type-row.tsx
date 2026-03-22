"use client";

import type { UseFormRegister } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/modules/assignments/schema";
import { QUESTION_TYPE_OPTIONS } from "@/modules/assignments/schema";
import { ChevronDown, Minus, Plus, X } from "lucide-react";

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
    <div className="mx-auto w-full max-w-[317px] space-y-1.5 rounded-[24px] bg-white p-3 md:mx-0 md:max-w-none md:rounded-none md:bg-transparent md:p-0">
      <div className="space-y-3 md:hidden">
        <div className="mx-auto flex h-5 w-[293px] max-w-full items-center justify-between rounded-[10px] bg-white">
          <div className="flex min-w-0 items-center gap-2">
            <select
              className="h-5 max-w-[190px] appearance-none bg-transparent px-0 text-[12px] font-medium text-[#2a2a2f]"
              {...register(`questionRows.${index}.type`)}
            >
              {QUESTION_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-[#555a63]" />
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove question row ${index + 1}`}
            className="inline-flex h-5 w-5 items-center justify-center text-[#353943]"
          >
            <X className="h-4 w-4" strokeWidth={2.8} />
          </button>
        </div>

        <div className="mx-auto h-[82px] w-[293px] max-w-full rounded-[24px] bg-[#F0F0F0] p-2">
          <div className="mb-2 grid grid-cols-2 gap-3 text-center text-[10px] font-medium text-[#6f737b]">
            <p>No. of Ques</p>
            <p>Marks</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex h-[38px] w-[132.5px] max-w-full items-center justify-between rounded-[100px] bg-white px-2">
              <button
                type="button"
                onClick={onDecrementQuestions}
                aria-label={`Decrease number of questions for row ${index + 1}`}
                className="inline-flex h-5 w-5 items-center justify-center text-[#6f737b]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-[12px] font-semibold text-[#3d4148]">{numberOfQuestions}</span>
              <button
                type="button"
                onClick={onIncrementQuestions}
                aria-label={`Increase number of questions for row ${index + 1}`}
                className="inline-flex h-5 w-5 items-center justify-center text-[#6f737b]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex h-[38px] w-[132.5px] max-w-full items-center justify-between rounded-[100px] bg-white px-2">
              <button
                type="button"
                onClick={onDecrementMarks}
                aria-label={`Decrease marks for row ${index + 1}`}
                className="inline-flex h-5 w-5 items-center justify-center text-[#6f737b]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-[12px] font-semibold text-[#3d4148]">{marksPerQuestion}</span>
              <button
                type="button"
                onClick={onIncrementMarks}
                aria-label={`Increase marks for row ${index + 1}`}
                className="inline-flex h-5 w-5 items-center justify-center text-[#6f737b]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden grid-cols-[minmax(0,1fr)_24px_132px_92px] items-center gap-2 md:grid">
        <select
          className="h-9 w-full rounded-[10px] border border-[#e3e3e6] bg-white px-3 text-[11px] text-[#2a2a2f]"
          {...register(`questionRows.${index}.type`)}
        >
          {QUESTION_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove question row ${index + 1}`}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#777b83] transition hover:bg-[#ececf0]"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="rounded-[999px] border border-[#e3e3e6] bg-white px-2 py-1">
          <p className="mb-1 text-center text-[9px] font-medium text-[#a0a3ab]">No. of Questions</p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onDecrementQuestions}
              aria-label={`Decrease number of questions for row ${index + 1}`}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#ebecef] text-[#7d8088] hover:bg-[#f6f6f8]"
            >
              <Minus className="h-2.5 w-2.5" />
            </button>
            <span className="text-[11px] font-semibold text-[#3d4148]">{numberOfQuestions}</span>
            <button
              type="button"
              onClick={onIncrementQuestions}
              aria-label={`Increase number of questions for row ${index + 1}`}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#ebecef] text-[#7d8088] hover:bg-[#f6f6f8]"
            >
              <Plus className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>

        <div className="rounded-[999px] border border-[#e3e3e6] bg-white px-2 py-1">
          <p className="mb-1 text-center text-[9px] font-medium text-[#a0a3ab]">Marks</p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onDecrementMarks}
              aria-label={`Decrease marks for row ${index + 1}`}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#ebecef] text-[#7d8088] hover:bg-[#f6f6f8]"
            >
              <Minus className="h-2.5 w-2.5" />
            </button>
            <span className="text-[11px] font-semibold text-[#3d4148]">{marksPerQuestion}</span>
            <button
              type="button"
              onClick={onIncrementMarks}
              aria-label={`Increase marks for row ${index + 1}`}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#ebecef] text-[#7d8088] hover:bg-[#f6f6f8]"
            >
              <Plus className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>
      </div>

      {rowErrors?.type ? <p className="text-[10px] text-rose-600">{rowErrors.type}</p> : null}
      {rowErrors?.numberOfQuestions ? <p className="text-[10px] text-rose-600">{rowErrors.numberOfQuestions}</p> : null}
      {rowErrors?.marksPerQuestion ? <p className="text-[10px] text-rose-600">{rowErrors.marksPerQuestion}</p> : null}

      <input type="hidden" {...register(`questionRows.${index}.numberOfQuestions`, { valueAsNumber: true })} />
      <input type="hidden" {...register(`questionRows.${index}.marksPerQuestion`, { valueAsNumber: true })} />
    </div>
  );
}