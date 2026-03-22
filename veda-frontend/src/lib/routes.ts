
export const ROUTES = {
    HOME: "/home",
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    AUTH_PROFILE: "/auth/profile",
    ASSIGNMENTS: "/assignments",
    CREATE_ASSIGNMENT: "/assignments/new",
    AI_TOOLKIT: "/ai-toolkit",  
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];


