"use client";

import { SignIn } from "@clerk/nextjs";
import { ROUTES } from "@/lib/routes";

export default function LoginPage() {
  return (
    <section className="rounded-2xl border border-[#eceff3] bg-white p-5 shadow-sm md:p-6">
      <SignIn
        path={ROUTES.LOGIN}
        routing="path"
        signUpUrl={ROUTES.SIGNUP}
        forceRedirectUrl={ROUTES.ASSIGNMENTS}
      />
    </section>
  );
}
