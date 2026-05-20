import express from "express";
import * as controller from "./inventoryRequest.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { requestActionSchema } from "./inventoryRequest.schema.js";

const router = express.Router();

router.get("/", controller.getAllRequests);
router.put(
  "/:requestId/approve",
  validate(requestActionSchema),
  controller.approveRequest,
);
router.put(
  "/:requestId/decline",
  validate(requestActionSchema),
  controller.declineRequest,
);

export default router;
