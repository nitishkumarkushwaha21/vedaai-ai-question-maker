import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f3f3f3] px-4 py-8 text-[#222] md:px-6">
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  );
}
