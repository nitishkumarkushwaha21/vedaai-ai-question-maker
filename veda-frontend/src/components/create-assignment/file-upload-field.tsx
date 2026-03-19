"use client";

import { Controller, type Control } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/modules/assignments/schema";

type FileUploadFieldProps = {
  control: Control<CreateAssignmentFormValues>;
};

export function FileUploadField({ control }: FileUploadFieldProps) {
  return (
    <Controller
      name="file"
      control={control}
      render={({ field }) => (
        <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it here</p>
          <p className="mt-1 text-xs text-gray-400">PDF, PNG, JPG up to 10MB</p>
          <label className="mt-4 inline-flex cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept="application/pdf,image/png,image/jpeg,text/plain"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                field.onChange(selected);
              }}
            />
          </label>
        </div>
      )}
    />
  );
}