import type { Metadata } from "next";
import type { ReactNode } from "react";
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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
