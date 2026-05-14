import express from "express";
import { AdminProductController as controller } from "./product.controller.js";

const router = express.Router();

router.get("/", controller.getAllProducts);

export default router;
