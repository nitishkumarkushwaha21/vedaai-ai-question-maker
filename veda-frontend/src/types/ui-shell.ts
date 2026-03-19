import type { AppRoute } from "@/lib/routes";

export type NavItem = {
  id: string;
  label: string;
  route: AppRoute;
  iconKey: "home" | "groups" | "assignments" | "library" | "toolkit";
  disabled?: boolean;
};