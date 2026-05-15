import express from "express";
import * as controller from "./home.controller.js";
import * as validate from "./home.validation.js";

const router = express.Router();

router.get(
  "/:branchId/bestsellers",
  validate.validateBranchId,
  controller.getBestSellingMenu,
);
router.get(
  "/:branchId/categories",
  validate.validateBranchId,
  controller.getAllCategories,
);

export default router;
