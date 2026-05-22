import express from "express";
import * as controller from "./kitchen.controller.js";

const router = express.Router();

router.get("/orders", controller.getKitchenOrders);

export default router;
