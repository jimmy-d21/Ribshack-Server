import express from "express";
import * as controller from "./order.controller.js";
import * as validate from "./order.validation.js";

const router = express.Router();

router.post("/checkout", validate.createOrder, controller.createOrder);

export default router;
