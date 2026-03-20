import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_USER_PROFILE, type AuthSession, type UserProfile } from "./auth.types";

type AuthState = {
  session: AuthSession;
  profile: UserProfile;
  signIn: (email: string, userId?: string) => void;
  signUp: (email: string, userId?: string) => void;
  signOut: () => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
};

const DEFAULT_SESSION: AuthSession = {
  userId: "demo-user-001",
  email: "",
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: DEFAULT_SESSION,
      profile: DEFAULT_USER_PROFILE,
      signIn: (email, userId) =>
        set((state) => ({
          session: {
            userId: userId || state.session.userId || "demo-user-001",
            email,
            isAuthenticated: true,
          },
        })),
      signUp: (email, userId) =>
        set((state) => ({
          session: {
            userId: userId || state.session.userId || `user-${Date.now()}`,
            email,
            isAuthenticated: true,
          },
        })),
      signOut: () =>
        set({
          session: {
            ...DEFAULT_SESSION,
            isAuthenticated: false,
          },
        }),
      updateProfile: (partial) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...partial,
          },
        })),
    }),
    {
      name: "veda-auth-store",
    },
  ),
);
