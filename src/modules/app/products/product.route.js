import express from "express";
import * as controller from "./product.controller.js";
import * as validate from "./product.validation.js";

const router = express.Router();

router.get(
  "/:productId",
  validate.getProductDetails,
  controller.getProductDetails,
);
router.get(
  "/:productId/addons",
  validate.getProductAddons,
  controller.getProductAddons,
);

export default router;
