"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const isAuthPage = pathname?.startsWith("/auth/");

    if (!isSignedIn && !isAuthPage) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoaded, isSignedIn, pathname, router]);
}
