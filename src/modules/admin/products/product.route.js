import express from "express";
import * as controller from "./product.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { productSchema } from "./product.schema.js";

const router = express.Router();

router.get("/", controller.getAllProducts);
router.get("/:productId", controller.getProductDetails);
router.post("/", validate(productSchema), controller.createProduct);
router.put("/:productId", validate(productSchema), controller.updateProduct);
router.delete("/:productId", controller.deleteProduct);
router.patch("/:productId/availability", controller.updateAvailability);

export default router;
