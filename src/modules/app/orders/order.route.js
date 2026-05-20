import express from "express";
import * as controller from "./order.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { createOrderSchema } from "./order.schema.js";

const router = express.Router();

router.get("/", controller.getAllOrders);
router.get("/:orderId", controller.getOrderDetails);
router.post("/checkout", validate(createOrderSchema), controller.createOrder);
router.delete("/:orderId", controller.deleteOrder);

export default router;
