"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/auth/auth.store";
import { ROUTES } from "@/lib/routes";

export default function ProfilePage() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [form, setForm] = useState(profile);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile(form);
    router.push(ROUTES.ASSIGNMENTS);
  };

  return (
    <section className="rounded-2xl border border-[#eceff3] bg-white p-5 shadow-sm md:p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Profile & School Settings</h1>
      <p className="mt-1 text-sm text-slate-500">All fields are optional. Defaults will be used when left blank.</p>

      <form onSubmit={onSubmit} className="mt-5 grid grid-cols-1 gap-4">
        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>User Name</span>
          <input
            value={form.userName}
            onChange={(event) => setForm((prev) => ({ ...prev, userName: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>School Name</span>
          <input
            value={form.schoolName}
            onChange={(event) => setForm((prev) => ({ ...prev, schoolName: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>School Location</span>
          <input
            value={form.schoolLocation}
            onChange={(event) => setForm((prev) => ({ ...prev, schoolLocation: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>School Icon URL</span>
          <input
            value={form.schoolIconUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, schoolIconUrl: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Teacher Subject</span>
          <input
            value={form.teacherSubject}
            onChange={(event) => setForm((prev) => ({ ...prev, teacherSubject: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Class Name</span>
          <input
            value={form.className}
            onChange={(event) => setForm((prev) => ({ ...prev, className: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Primary Subject</span>
          <input
            value={form.subject}
            onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Default Time Allowed (minutes)</span>
          <input
            type="number"
            min={10}
            value={form.timeAllowedMinutes}
            onChange={(event) => setForm((prev) => ({ ...prev, timeAllowedMinutes: Math.max(10, Number(event.target.value || 45)) }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <button type="submit" className="mt-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Save Settings
        </button>
      </form>
    </section>
  );
}
