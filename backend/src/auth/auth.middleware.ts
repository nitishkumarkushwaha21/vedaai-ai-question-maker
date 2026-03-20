import type { Request, Response, NextFunction } from "express";
import { verifyClerkBearerToken, verifyClerkUserIdFromHeader } from "./clerk";
import { sendError } from "../utils/response";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header("authorization") ?? undefined;
  if (authorization) {
    try {
      const verifiedUid = await verifyClerkBearerToken(authorization);
      if (verifiedUid) {
        res.locals.authUserId = verifiedUid;
        next();
        return;
      }
    } catch {
      sendError(res, 401, "UNAUTHORIZED", "Invalid Clerk token");
      return;
    }
  }

  const userIdHeader = req.header("x-user-id") ?? req.header("x-clerk-user-id") ?? undefined;
  const parsed = verifyClerkUserIdFromHeader(userIdHeader);

  res.locals.authUserId = parsed ?? "demo-user-001";
  next();
}
