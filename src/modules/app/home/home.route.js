import express from "express";
import * as controller from "./home.controller.js";

const router = express.Router();

router.get("/:branchId/bestsellers", controller.getBestSellingMenu);
router.get("/:branchId/categories", controller.getAllCategories);

export default router;
