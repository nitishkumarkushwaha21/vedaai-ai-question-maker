import { Router } from "express";
import { createAssignmentController } from "../modules/assignments/assignment.controller";

export function createAssignmentRouter() {
  const router = Router();
  const controller = createAssignmentController();

  router.post("/", controller.createOrUpdate);
  router.get("/", controller.list);
  router.get("/:assignmentId", controller.getById);
  router.delete("/:assignmentId", controller.remove);

  return router;
}
