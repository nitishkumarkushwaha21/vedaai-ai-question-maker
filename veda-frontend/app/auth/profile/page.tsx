"use client";

import { ArrowLeft, School, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <section aria-label="Profile page" className="pb-10 md:pb-4">
      <div className="relative left-1/2 w-[min(1120px,calc(100vw-1.5rem))] -translate-x-1/2 rounded-[28px] border border-[#e3e7ed] bg-[#ffffffd9] px-4 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] md:px-8 md:py-8">
        <button
          type="button"
          onClick={() => router.push(ROUTES.HOME)}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d7dce3] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#303540] transition hover:bg-[#f6f8fb] md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>

        <form className="space-y-7" onSubmit={(event) => event.preventDefault()}>
          <div className="hidden items-start gap-10 md:grid md:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="space-y-8">
              <div className="flex flex-col items-center gap-3 rounded-[20px] border border-[#e4e8ee] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#dbe0e8] bg-[#f7f9fc] text-[#7b8390]">
                  <UserRound className="h-12 w-12" strokeWidth={1.7} />
                </div>
                <p className="text-[13px] font-semibold text-[#30343c]">Profile Avatar</p>
              </div>

              <div className="flex flex-col items-center gap-3 rounded-[20px] border border-[#e4e8ee] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#dbe0e8] bg-[#f7f9fc] text-[#7b8390]">
                  <School className="h-12 w-12" strokeWidth={1.7} />
                </div>
                <p className="text-[13px] font-semibold text-[#30343c]">School Logo</p>
              </div>
            </aside>

            <div className="space-y-6">
              <section className="rounded-[24px] border border-[#e3e7ed] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <h2 className="text-[20px] font-semibold text-[#1f2329]">Profile Form</h2>
                <p className="mt-1 text-[11px] text-[#8e95a1]">Personal details and teaching information</p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-[11px] font-semibold text-[#2f3238]">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-[11px] font-semibold text-[#2f3238]">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="teacher@school.edu"
                      disabled
                      className="h-10 w-full cursor-not-allowed rounded-[12px] border border-[#dfe4eb] bg-[#f5f7fb] px-3 text-[12px] text-[#6a7280] placeholder:text-[#a3aab6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="teacherClass" className="text-[11px] font-semibold text-[#2f3238]">Teacher Class</label>
                    <input
                      id="teacherClass"
                      name="teacherClass"
                      type="text"
                      placeholder="e.g Class 8"
                      className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="teacherSubject" className="text-[11px] font-semibold text-[#2f3238]">Teacher Subject</label>
                    <input
                      id="teacherSubject"
                      name="teacherSubject"
                      type="text"
                      placeholder="e.g Mathematics"
                      className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[24px] border border-[#e3e7ed] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <h2 className="text-[20px] font-semibold text-[#1f2329]">School Form</h2>
                <p className="mt-1 text-[11px] text-[#8e95a1]">School details for branding and identity</p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="schoolName" className="text-[11px] font-semibold text-[#2f3238]">School Name</label>
                    <input
                      id="schoolName"
                      name="schoolName"
                      type="text"
                      placeholder="Enter school name"
                      className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="location" className="text-[11px] font-semibold text-[#2f3238]">Location</label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="City, State"
                      className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                    />
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <label htmlFor="schoolIconUrl" className="text-[11px] font-semibold text-[#2f3238]">School Icon URL</label>
                    <input
                      id="schoolIconUrl"
                      name="schoolIconUrl"
                      type="url"
                      placeholder="https://example.com/school-logo.png"
                      className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="space-y-5 md:hidden">
            <div className="flex flex-col items-center gap-3 rounded-[20px] border border-[#e4e8ee] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#dbe0e8] bg-[#f7f9fc] text-[#7b8390]">
                <UserRound className="h-12 w-12" strokeWidth={1.7} />
              </div>
              <p className="text-[13px] font-semibold text-[#30343c]">Profile Avatar</p>
            </div>

            <section className="rounded-[20px] border border-[#e3e7ed] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <h2 className="inline-block border-b-2 border-black pb-1 text-[18px] font-semibold text-[#1f2329]">Profile Form</h2>

              <div className="mt-4 space-y-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="name-mobile" className="text-[11px] font-semibold text-[#2f3238]">Name</label>
                  <input
                    id="name-mobile"
                    name="nameMobile"
                    type="text"
                    placeholder="Enter your full name"
                    className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email-mobile" className="text-[11px] font-semibold text-[#2f3238]">Email</label>
                  <input
                    id="email-mobile"
                    name="emailMobile"
                    type="email"
                    placeholder="teacher@school.edu"
                    disabled
                    className="h-10 w-full cursor-not-allowed rounded-[12px] border border-[#dfe4eb] bg-[#f5f7fb] px-3 text-[12px] text-[#6a7280] placeholder:text-[#a3aab6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="teacherClass-mobile" className="text-[11px] font-semibold text-[#2f3238]">Teacher Class</label>
                  <input
                    id="teacherClass-mobile"
                    name="teacherClassMobile"
                    type="text"
                    placeholder="e.g Class 8"
                    className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="teacherSubject-mobile" className="text-[11px] font-semibold text-[#2f3238]">Teacher Subject</label>
                  <input
                    id="teacherSubject-mobile"
                    name="teacherSubjectMobile"
                    type="text"
                    placeholder="e.g Mathematics"
                    className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col items-center gap-3 rounded-[20px] border border-[#e4e8ee] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#dbe0e8] bg-[#f7f9fc] text-[#7b8390]">
                <School className="h-12 w-12" strokeWidth={1.7} />
              </div>
              <p className="text-[13px] font-semibold text-[#30343c]">School Logo</p>
            </div>

            <section className="rounded-[20px] border border-[#e3e7ed] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <h2 className="inline-block border-b-2 border-black pb-1 text-[18px] font-semibold text-[#1f2329]">School Form</h2>

              <div className="mt-4 space-y-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="schoolName-mobile" className="text-[11px] font-semibold text-[#2f3238]">School Name</label>
                  <input
                    id="schoolName-mobile"
                    name="schoolNameMobile"
                    type="text"
                    placeholder="Enter school name"
                    className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="location-mobile" className="text-[11px] font-semibold text-[#2f3238]">Location</label>
                  <input
                    id="location-mobile"
                    name="locationMobile"
                    type="text"
                    placeholder="City, State"
                    className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="schoolIconUrl-mobile" className="text-[11px] font-semibold text-[#2f3238]">School Icon URL</label>
                  <input
                    id="schoolIconUrl-mobile"
                    name="schoolIconUrlMobile"
                    type="url"
                    placeholder="https://example.com/school-logo.png"
                    className="h-10 w-full rounded-[12px] border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#22262d] placeholder:text-[#9ea5b1]"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end border-t border-[#e4e8ef] pt-4">
            <button
              type="submit"
              className="h-11 w-full rounded-[14px] bg-[#181818] px-6 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(24,24,24,0.22)] transition hover:bg-[#2a2a2a] md:w-auto"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
