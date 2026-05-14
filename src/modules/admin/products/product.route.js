import express from "express";
import { AdminProductController as controller } from "./product.controller.js";
import { AdminProductValidation as validate } from "./product.validation.js";

const router = express.Router();

router.get("/", controller.getAllProducts);
router.get(
  "/:productId",
  validate.getProductDetails,
  controller.getProductDetails,
);
router.post("/", validate.createProduct, controller.createProduct);
router.put("/:productId", validate.updateProduct, controller.updateProduct);
router.delete("/:productId", validate.deleteProduct, controller.deleteProduct);
router.patch(
  "/:productId/availability",
  validate.updateAvailability,
  controller.updateAvailability,
);

export default router;
