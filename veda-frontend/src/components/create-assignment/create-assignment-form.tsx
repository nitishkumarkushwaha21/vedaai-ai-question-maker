"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CalendarPlus2, Mic, Plus } from "lucide-react";
import {
  createAssignmentSchema,
  type CreateAssignmentFormValues,
  QUESTION_TYPE_OPTIONS,
  SECTION_GROUPING_TAG_OPTIONS,
} from "@/modules/assignments/schema";
import { FileUploadField } from "@/components/create-assignment/file-upload-field";
import { QuestionTypeRow } from "@/components/create-assignment/question-type-row";
import { ROUTES } from "@/lib/routes";
import { ENV } from "@/lib/env";
import { buildGenerationRequestPayload } from "@/modules/assignments/build-generation-request";
import { useAuthStore } from "@/auth/auth.store";
import { useAssignmentDraftStore } from "@/store/assignment-draft-store";
import { useGenerationSubmitStore } from "@/store/generation-submit-store";

function buildDeterministicAssignmentId(values: CreateAssignmentFormValues) {
  const safeDate = (values.dueDate || "na").replace(/[^0-9]/g, "");
  const signature = values.questionRows
    .map((row) => `${row.type}:${row.numberOfQuestions}x${row.marksPerQuestion}`)
    .join("|");

  return `a-${safeDate}-${signature.length}`;
}

type CreateAssignmentFormProps = {
  onProgressChange?: (progress: number) => void;
};

export function CreateAssignmentForm({ onProgressChange }: CreateAssignmentFormProps) {
  const router = useRouter();
  const dueDateInputRef = useRef<HTMLInputElement | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(createAssignmentSchema),
    mode: "onChange",
    defaultValues: {
      dueDate: "",
      questionRows: [
        {
          type: QUESTION_TYPE_OPTIONS[0],
          numberOfQuestions: 4,
          marksPerQuestion: 1,
        },
        {
          type: QUESTION_TYPE_OPTIONS[1],
          numberOfQuestions: 3,
          marksPerQuestion: 2,
        },
        {
          type: QUESTION_TYPE_OPTIONS[2],
          numberOfQuestions: 5,
          marksPerQuestion: 5,
        },
        {
          type: QUESTION_TYPE_OPTIONS[3],
          numberOfQuestions: 5,
          marksPerQuestion: 5,
        },
      ],
      sectionGroupingTag: undefined,
      additionalInstructions: "",
    },
  });

  const { control, register, handleSubmit, formState: { errors, isValid, dirtyFields }, setValue } = form;
  const dueDateField = register("dueDate");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questionRows",
  });

  const watchedQuestionRows = useWatch({ control, name: "questionRows" });
  const watchedDueDate = useWatch({ control, name: "dueDate" });
  const watchedAdditionalInstructions = useWatch({ control, name: "additionalInstructions" });
  const watchedSectionGroupingTag = useWatch({ control, name: "sectionGroupingTag" });
  const watchedFile = useWatch({ control, name: "file" });
  const questionRows = useMemo(() => watchedQuestionRows ?? [], [watchedQuestionRows]);

  const completionPercent = useMemo(() => {
    const hasDueDate = Boolean(watchedDueDate);
    const touchedQuestionConfig = Boolean(dirtyFields.questionRows);
    const hasInstructions = Boolean(watchedAdditionalInstructions?.trim());
    const hasFile = Boolean(watchedFile);

    let score = 0;
    if (hasDueDate) score += 35;
    if (touchedQuestionConfig) score += 35;
    if (hasInstructions) score += 15;
    if (hasFile) score += 15;

    return Math.min(100, score);
  }, [dirtyFields.questionRows, watchedAdditionalInstructions, watchedDueDate, watchedFile]);

  useEffect(() => {
    onProgressChange?.(completionPercent);
  }, [completionPercent, onProgressChange]);

  const totals = useMemo(() => {
    const totalQuestions = questionRows.reduce((sum, row) => sum + (row.numberOfQuestions || 0), 0);
    const totalMarks = questionRows.reduce(
      (sum, row) => sum + (row.numberOfQuestions || 0) * (row.marksPerQuestion || 0),
      0,
    );
    return { totalQuestions, totalMarks };
  }, [questionRows]);

  const rowErrors = errors.questionRows;

  
  const { setAssignmentDraft } = useAssignmentDraftStore();
  const { setGenerationSubmitDraft } = useGenerationSubmitStore();
  const userId = useAuthStore((state) => state.session.userId);
  const { userId: clerkUserId, getToken } = useAuth();

  const saveDraft = async (values: CreateAssignmentFormValues, autoStartGeneration: boolean) => {
    setSubmitError(null);
    setSubmitting(true);

    setAssignmentDraft(values);
    const assignmentId = buildDeterministicAssignmentId(values);
    const resolvedUserId = clerkUserId || userId || "demo-user-001";
    const request = buildGenerationRequestPayload(assignmentId, values, resolvedUserId);
    setGenerationSubmitDraft({ request, clientStatus: "queued" });

    const questionTypes = values.questionRows.map((row) => ({
      type: row.type,
      numberOfQuestions: row.numberOfQuestions,
      marksPerQuestion: row.marksPerQuestion,
      totalMarks: row.numberOfQuestions * row.marksPerQuestion,
    }));

    const totalQuestions = values.questionRows.reduce((sum, row) => sum + row.numberOfQuestions, 0);
    const totalMarks = values.questionRows.reduce((sum, row) => sum + row.numberOfQuestions * row.marksPerQuestion, 0);

    try {
      const token = await getToken();
      const response = await fetch(`${ENV.API_URL}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-user-id": resolvedUserId,
        },
        body: JSON.stringify({
          assignmentId,
          title: `Assessment ${values.dueDate}`,
          dueDate: values.dueDate,
          questionTypes,
          totalQuestions,
          totalMarks,
          additionalInstructions: values.additionalInstructions,
          sourceFileAttached: Boolean(values.file),
        }),
      });

      const payload = (await response.json()) as { ok: boolean; error?: { message?: string } };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error?.message ?? "Failed to save assignment");
      }

      setDraftSaved(true);
      router.push(autoStartGeneration ? `${ROUTES.AI_TOOLKIT}?autostart=1` : ROUTES.AI_TOOLKIT);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to save assignment");
    } finally {
      setSubmitting(false);
    }

    console.log("Create assignment payload:", values);
  };

  const onSaveAndContinue = handleSubmit(async (values) => {
    await saveDraft(values, false);
  });

  const onGenerateNow = handleSubmit(async (values) => {
    await saveDraft(values, true);
  });

  const openDueDatePicker = () => {
    const input = dueDateInputRef.current;
    if (!input) {
      return;
    }

    const pickerInput = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof pickerInput.showPicker === "function") {
      pickerInput.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  return (
    <form onSubmit={onSaveAndContinue} className="space-y-6">
      <div className="mx-auto w-full max-w-[810px] space-y-6 rounded-[32px] bg-[#FFFFFF80] p-4 md:w-[810px] md:bg-[#FFFFFF80] md:p-8">
        <div>
          <h2 className="text-[22px] font-semibold text-[#202227]">Assignment Details</h2>
          <p className="text-[11px] text-[#9ea2aa]">Basic information about your assignment</p>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-[#2f3238]">Upload Material (Optional)</p>
          <FileUploadField control={control} />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#2f3238]">Due Date</label>
          <div
            className="relative cursor-pointer"
            onClick={openDueDatePicker}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDueDatePicker();
              }
            }}
            aria-label="Open due date picker"
          >
            <input
              type="date"
              className="h-9 w-full rounded-[10px] border border-[#e2e4e8] bg-white px-3 pr-9 text-[11px] text-[#2a2d33] [appearance:textfield] [&::-webkit-calendar-picker-indicator]:opacity-0"
              placeholder="Choose a chapter"
              name={dueDateField.name}
              onBlur={dueDateField.onBlur}
              onChange={dueDateField.onChange}
              ref={(node) => {
                dueDateField.ref(node);
                dueDateInputRef.current = node;
              }}
            />
            <span
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#8f949d]"
              aria-hidden="true"
            >
              <CalendarPlus2 className="h-3.5 w-3.5" />
            </span>
          </div>
          {errors.dueDate ? <p className="text-[10px] text-rose-600">{errors.dueDate.message}</p> : null}
        </div>

        <div className="space-y-2">
          <div className="hidden grid-cols-[minmax(0,1fr)_118px_86px] items-end gap-2 sm:grid-cols-[minmax(0,1fr)_132px_92px] md:grid">
            <label className="text-[11px] font-semibold text-[#2f3238]">Question Type</label>
            <p className="pb-1 text-center text-[10px] font-medium text-[#8e939c]">No of Questions</p>
            <p className="pb-1 text-center text-[10px] font-medium text-[#8e939c]">Marks</p>
          </div>

          <label className="text-[11px] font-semibold text-[#2f3238] md:hidden">Question Type</label>

          <div className="space-y-2">
            {fields.map((field, index) => (
              (() => {
                const row = questionRows[index];
                const rowError = rowErrors?.[index];
                const numberOfQuestions = Math.max(1, row?.numberOfQuestions ?? 1);
                const marksPerQuestion = Math.max(1, row?.marksPerQuestion ?? 1);

                return (
                  <QuestionTypeRow
                    key={field.id}
                    index={index}
                    register={register}
                    numberOfQuestions={numberOfQuestions}
                    marksPerQuestion={marksPerQuestion}
                    onIncrementQuestions={() => {
                      setValue(`questionRows.${index}.numberOfQuestions`, numberOfQuestions + 1, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                    onDecrementQuestions={() => {
                      setValue(`questionRows.${index}.numberOfQuestions`, Math.max(1, numberOfQuestions - 1), {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                    onIncrementMarks={() => {
                      setValue(`questionRows.${index}.marksPerQuestion`, marksPerQuestion + 1, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                    onDecrementMarks={() => {
                      setValue(`questionRows.${index}.marksPerQuestion`, Math.max(1, marksPerQuestion - 1), {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                    rowErrors={{
                      type: rowError?.type?.message,
                      numberOfQuestions: rowError?.numberOfQuestions?.message,
                      marksPerQuestion: rowError?.marksPerQuestion?.message,
                    }}
                    onRemove={() => remove(index)}
                  />
                );
              })()
            ))}
          </div>

          {errors.questionRows?.message ? <p className="text-[10px] text-rose-600">{errors.questionRows.message}</p> : null}

          <button
            type="button"
            onClick={() =>
              append({
                type: QUESTION_TYPE_OPTIONS[0],
                numberOfQuestions: 1,
                marksPerQuestion: 1,
              })
            }
            className="inline-flex items-center gap-3 rounded-full px-0 py-1 text-[12px] font-semibold text-[#1f2329]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#181818] text-white md:h-8 md:w-8">
              <Plus className="h-6 w-6 md:h-5 md:w-5" strokeWidth={2.6} />
            </span>
            Add Question Type
          </button>
        </div>

        <div className="text-right text-[12px] font-medium text-[#2f3238]">
          <p>Total Questions : {totals.totalQuestions}</p>
          <p>Total Marks: {totals.totalMarks}</p>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-[#2f3238]">Sectioning Tag (Optional)</label>
          <div className="flex flex-wrap gap-2">
            {SECTION_GROUPING_TAG_OPTIONS.map((tag) => {
              const active = watchedSectionGroupingTag === tag;
              const label = tag === "question-type" ? "By Question Type" : tag === "difficulty" ? "By Difficulty" : "By Marks";

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setValue("sectionGroupingTag", active ? undefined : tag, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                    active
                      ? "border-[#181818] bg-[#181818] text-white"
                      : "border-[#d7dbe2] bg-white text-[#4d535d] hover:bg-[#f4f5f7]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#2f3238]">Additional Information (For better output)</label>
          <div className="relative h-[102px] w-full rounded-[16px] border-[1.25px] border-dashed border-[#d5d9df] p-4 md:w-[746px]">
            <textarea
              rows={2}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="h-full w-full resize-none bg-transparent pr-10 text-[11px] text-[#2a2d33] outline-none placeholder:text-[#9ca3af]"
              {...register("additionalInstructions")}
            />
            <button
              type="button"
              aria-label="Voice prompt input"
              className="absolute bottom-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#6b7280] shadow-[0_2px_8px_rgba(15,23,42,0.2)]"
            >
              <Mic className="h-3 w-3" />
            </button>
          </div>
          {errors.additionalInstructions ? <p className="text-[10px] text-rose-600">{errors.additionalInstructions.message}</p> : null}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[810px] items-center justify-between px-1">
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e3e5ea] bg-white px-4 py-2 text-[11px] font-semibold text-[#4d535d]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Previous
        </button>

        <button
          type="button"
          onClick={onGenerateNow}
          disabled={!isValid || submitting}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#181818] px-5 py-2 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Next"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mx-auto w-full max-w-[810px] space-y-1 px-1">
        {draftSaved ? <p className="text-[10px] text-emerald-600">Draft saved and synced.</p> : null}
        {submitError ? <p className="text-[10px] text-rose-600">{submitError}</p> : null}
        {!submitError ? <p className="text-[10px] text-[#9aa0a8]">Progress: {completionPercent}%</p> : null}
      </div>
    </form>
  );
}