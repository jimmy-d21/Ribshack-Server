import express from "express";
import * as controller from "./product.controller.js";

const router = express.Router();

router.get("/:productId", controller.getProductDetails);
router.get("/:productId/addons", controller.getProductAddons);

export default router;
