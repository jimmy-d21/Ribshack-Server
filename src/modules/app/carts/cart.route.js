import express from "express";
import * as controller from "./cart.controller.js";
import * as validate from "./cart.validation.js";

const router = express.Router();

router.get("/", validate.getAllCarts, controller.getAllCarts);
router.post("/items", validate.addToCart, controller.addToCart);
router.put("/items/:itemId", validate.updateCart, controller.updateCart);

export default router;
