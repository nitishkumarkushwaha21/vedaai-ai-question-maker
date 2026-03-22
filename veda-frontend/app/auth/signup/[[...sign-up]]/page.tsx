"use client";

import { SignUp } from "@clerk/nextjs";
import { ROUTES } from "@/lib/routes";

export default function SignupCatchAllPage() {
  return (
    <section className="rounded-2xl border border-[#eceff3] bg-white p-5 shadow-sm md:p-6">
      <SignUp
        path={ROUTES.SIGNUP}
        routing="path"
        signInUrl={ROUTES.LOGIN}
        forceRedirectUrl={ROUTES.AUTH_PROFILE}
      />
    </section>
  );
}
