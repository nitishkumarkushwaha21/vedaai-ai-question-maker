import { verifyToken } from "@clerk/backend";
import { ENV } from "../config/env";

export async function verifyClerkBearerToken(authHeader: string | undefined): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token || !ENV.CLERK_SECRET_KEY.trim()) {
    return null;
  }

  const payload = await verifyToken(token, {
    secretKey: ENV.CLERK_SECRET_KEY,
  });

  if (!payload.sub) {
    return null;
  }

  return payload.sub;
}

export function verifyClerkUserIdFromHeader(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  return value.trim() || null;
}
