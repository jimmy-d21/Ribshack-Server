import express from "express";
import * as controller from "./inventory.controller.js";

const router = express.Router();

router.get("/", controller.getAllInventory);
router.get("/alerts", controller.getAllInventoryCritical);

export default router;
