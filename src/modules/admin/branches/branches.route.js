import express from "express";
import { AdminBranchesController as controller } from "./branches.controller.js";
import { AdminBranchesValidation as validate } from "./branches.validation.js";

const router = express.Router();

router.get("/", controller.getAllBranches);
router.get(
  "/:branchId",
  validate.getBranchDetails,
  controller.getBranchDetails,
);
router.post("/", validate.createBranch, controller.createBranch);
router.put("/:branchId", validate.updateBranch, controller.updateBranch);
router.delete("/:branchId", validate.deleteBranch, controller.deleteBranch);
router.patch(
  "/:branchId/status/:status",
  validate.updateBranchStatus,
  controller.updateBranchStatus,
);

export default router;
