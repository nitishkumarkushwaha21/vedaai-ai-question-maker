import { ROUTES } from "@/lib/routes";
import type { NavItem } from "@/types/ui-shell";

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", route: ROUTES.HOME, iconKey: "home", disabled: true },
  { id: "groups", label: "My Groups", route: ROUTES.HOME, iconKey: "groups", disabled: true },
  { id: "assignments", label: "Assignments", route: ROUTES.ASSIGNMENTS, iconKey: "assignments" },
  { id: "toolkit", label: "AI Teacher's Toolkit", route: ROUTES.AI_TOOLKIT, iconKey: "toolkit" },
  { id: "library", label: "My Library", route: ROUTES.HOME, iconKey: "library", disabled: true },
];


export const MOBILE_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", route: ROUTES.HOME, iconKey: "home", disabled: true },
  { id: "groups", label: "My Groups", route: ROUTES.HOME, iconKey: "groups", disabled: true },
  { id: "library", label: "Library", route: ROUTES.HOME, iconKey: "library", disabled: true },
  { id: "toolkit", label: "AI Toolkit", route: ROUTES.AI_TOOLKIT, iconKey: "toolkit" },
];