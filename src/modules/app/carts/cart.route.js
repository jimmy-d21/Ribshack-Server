import express from "express";
import * as controller from "./cart.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { addToCartSchema, updateCartSchema } from "./cart.schema.js";

const router = express.Router();

router.get("/:branchId", controller.getAllCarts);
router.post("/items", validate(addToCartSchema), controller.addToCart);
router.put("/items/:itemId", validate(updateCartSchema), controller.updateCart);
router.delete("/items/:itemId", controller.deleteCartItem);
router.delete("/", controller.deleteAllCartItem);

export default router;
