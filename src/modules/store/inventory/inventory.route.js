import express from "express";
import * as controller from "./inventory.controller.js";
import * as validate from "./inventory.validation.js";

const router = express.Router();

router.get("/", validate.validateBranch, controller.getAllInventory);
router.get(
  "/alerts",
  validate.validateBranch,
  controller.getAllInventoryCritical,
);
router.get(
  "/:itemId",
  validate.getInventoryDetails,
  controller.getInventoryDetails,
);
router.post("/", validate.addInventoryItem, controller.addInventoryItem);

export default router;
