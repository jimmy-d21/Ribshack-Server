import express from "express";
import { AdminInventoryRequestController as controller } from "./inventoryRequest.controller.js";
import { AdminInventoryRequestValidation as validate } from "./inventoryRequest.validation.js";

const router = express.Router();

router.get("/", controller.getAllRequests);
// Todo: update also the store inventory
router.put(
  "/:requestId/approve",
  validate.approveRequest,
  controller.approveRequest,
);
router.put(
  "/:requestId/decline",
  validate.declineRequest,
  controller.declineRequest,
);

export default router;
