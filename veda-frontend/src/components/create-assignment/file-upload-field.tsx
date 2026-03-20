"use client";

import { Controller, type Control } from "react-hook-form";
import { UploadCloud } from "lucide-react";
import type { CreateAssignmentFormValues } from "@/modules/assignments/schema";

type FileUploadFieldProps = {
  control: Control<CreateAssignmentFormValues>;
};

export function FileUploadField({ control }: FileUploadFieldProps) {
  return (
    <Controller
      name="file"
      control={control}
      render={({ field, fieldState }) => (
        <div className="rounded-[14px] border border-dashed border-[#d8dbe1] bg-white px-4 py-5 text-center">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#666a72]">
            <UploadCloud className="h-4.5 w-4.5" />
          </span>
          <p className="mt-1 text-[11px] font-medium text-[#2a2d33]">Choose a file or drag & drop it here</p>
          <p className="mt-1 text-[10px] text-[#a3a6ad]">JPEG, PNG, upto 10MB</p>
          <label className="mt-3 inline-flex cursor-pointer rounded-full bg-[#f1f2f4] px-4 py-1.5 text-[10px] font-medium text-[#3e434b]">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                field.onChange(selected);
              }}
            />
          </label>

          <p className="mt-3 text-[10px] text-[#999da5]">Upload images of your preferred document/image</p>

          {field.value ? (
            <div className="mt-2 space-y-1 text-left">
              <p className="text-[10px] text-emerald-700">
                Selected: {field.value.name} ({Math.max(1, Math.round(field.value.size / 1024))} KB)
              </p>
              <button
                type="button"
                onClick={() => field.onChange(undefined)}
                className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] text-gray-600"
              >
                Remove file
              </button>
            </div>
          ) : null}

          {fieldState.error ? <p className="mt-2 text-[10px] text-rose-600">{fieldState.error.message}</p> : null}
        </div>
      )}
    />
  );
}