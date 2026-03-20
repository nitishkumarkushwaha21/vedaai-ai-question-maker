"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAssignmentSchema,
  type CreateAssignmentFormValues,
  QUESTION_TYPE_OPTIONS,
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

export function CreateAssignmentForm() {
  const router = useRouter();
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
          numberOfQuestions: 1,
          marksPerQuestion: 1,
        },
      ],
      additionalInstructions: "",
    },
  });

  const { control, register, handleSubmit, reset, formState: { errors, isValid, dirtyFields }, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questionRows",
  });

  const watchedQuestionRows = useWatch({ control, name: "questionRows" });
  const watchedDueDate = useWatch({ control, name: "dueDate" });
  const watchedAdditionalInstructions = useWatch({ control, name: "additionalInstructions" });
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

  return (
    <form onSubmit={onSaveAndContinue} className="space-y-5 rounded-2xl bg-white p-4 md:p-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Assignment Details</h2>
        <p className="text-sm text-gray-500">Basic information about your assignment</p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          <span>Form Progress</span>
          <span>{completionPercent}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-gray-800 transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      <FileUploadField control={control} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          {...register("dueDate")}
        />
        {errors.dueDate ? <p className="text-xs text-rose-600">{errors.dueDate.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Question Type</label>
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

        {errors.questionRows?.message ? <p className="text-xs text-rose-600">{errors.questionRows.message}</p> : null}

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
        {errors.additionalInstructions ? <p className="text-xs text-rose-600">{errors.additionalInstructions.message}</p> : null}
      </div>

      {draftSaved ? <p className="text-xs text-emerald-600">Draft saved to local store</p> : null}
      {submitError ? <p className="text-xs text-rose-600">{submitError}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            setDraftSaved(false);
          }}
          className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600"
        >
          Reset Form
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Draft & Continue"}
          </button>
          <button
            type="button"
            onClick={onGenerateNow}
            disabled={!isValid || submitting}
            className="rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Generate Question Paper"}
          </button>
        </div>
      </div>
    </form>
  );
}