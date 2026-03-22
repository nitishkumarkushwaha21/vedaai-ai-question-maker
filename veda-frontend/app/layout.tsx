import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ROUTES } from "@/lib/routes";
import "./globals.css";


export const metadata: Metadata = {
  title: "VedaAI Frontend",
  description: "AI Assessment Creator frontend",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClerkProvider
          signInFallbackRedirectUrl={ROUTES.ASSIGNMENTS}
          signInForceRedirectUrl={ROUTES.ASSIGNMENTS}
          signUpFallbackRedirectUrl={ROUTES.AUTH_PROFILE}
          signUpForceRedirectUrl={ROUTES.AUTH_PROFILE}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
