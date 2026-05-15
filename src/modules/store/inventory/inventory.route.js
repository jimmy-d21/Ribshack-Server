import express from "express";
import * as controller from "./inventory.controller.js";
import * as validate from "./inventory.validation.js";

const router = express.Router();

router.get("/", controller.getAllInventory);
router.get("/alerts", controller.getAllInventoryCritical);
router.get(
  "/:itemId",
  validate.getInventoryDetails,
  controller.getInventoryDetails,
);
router.post("/", validate.addInventoryItem, controller.addInventoryItem);
router.put("/:itemId", validate.updateInventory, controller.updateInventory);
router.delete("/:itemId", validate.deleteInventory, controller.deleteInventory);
router.post(
  "/:itemId/restock-request",
  validate.inventoryRequest,
  controller.inventoryRequest,
);

export default router;
