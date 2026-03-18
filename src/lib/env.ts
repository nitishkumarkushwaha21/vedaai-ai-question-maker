export const ENV = {
	SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000",
	API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
} as const;