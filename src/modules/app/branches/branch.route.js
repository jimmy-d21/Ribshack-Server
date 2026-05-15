import express from "express";
import * as controller from "./branch.controller.js";
import * as validate from "./branch.validation.js";

const router = express.Router();

router.get("/", controller.getAllAvailableBranches);

router.get(
  "/:branchId",
  validate.validateBranchId,
  controller.getBranchDetails,
);
router.get(
  "/:branchId/menu",
  validate.validateBranchId,
  controller.getAllBranchMenu,
);

export default router;
