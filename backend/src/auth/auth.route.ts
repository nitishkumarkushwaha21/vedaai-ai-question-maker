import { Router } from "express";
import { sendSuccess } from "../utils/response";

export function createAuthRouter() {
  const router = Router();

  router.get("/me", (_req, res) => {
    const userId = String(res.locals.authUserId ?? "demo-user-001");

    return sendSuccess(res, 200, {
      userId,
      provider: "clerk",
    });
  });

  return router;
}
