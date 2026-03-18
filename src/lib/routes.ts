
export const ROUTES = {
    HOME: "/",
    ASSIGNMENTS: "/assignments",
    CREATE_ASSIGNMENT: "/assignments/new",
    AI_TOOLKIT: "/ai-toolkit",  
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];


