import express from "express";
import { AdminProductController as controller } from "./product.controller.js";
import { AdminProductValidation as validate } from "./product.validation.js";

const router = express.Router();

router.get("/", controller.getAllProducts);
router.post("/", validate.createProduct, controller.createProduct);

export default router;
