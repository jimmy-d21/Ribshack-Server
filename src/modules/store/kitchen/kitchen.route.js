import express from "express";
import * as controller from "./kitchen.controller.js";

const router = express.Router();

router.get("/orders", controller.getOrders);
router.get("/orders/:orderId", controller.getOrderDetails);

export default router;
