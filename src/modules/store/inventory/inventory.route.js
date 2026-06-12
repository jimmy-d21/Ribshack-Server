import express from "express";
import * as controller from "./inventory.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import {
  inventoryItemSchema,
  inventoryRequestSchema,
} from "./inventory.schema.js";

const router = express.Router();

router.get("/", controller.getAllInventory);
router.get("/kpis", controller.getRequestKPIS);
router.get("/alerts", controller.getAllInventoryCritical);
router.get("/:itemId", controller.getInventoryDetails);
router.post("/", validate(inventoryItemSchema), controller.addInventoryItem);
router.put(
  "/:itemId",
  validate(inventoryItemSchema),
  controller.updateInventory,
);
router.delete("/:itemId", controller.deleteInventory);
router.post(
  "/:itemId/restock-request",
  validate(inventoryRequestSchema),
  controller.inventoryRequest,
);

export default router;
