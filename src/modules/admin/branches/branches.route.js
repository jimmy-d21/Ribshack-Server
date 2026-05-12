import express from "express";
import AdminBranchesController from "./branches.controller.js";

const router = express.Router();

router.get("/", AdminBranchesController.getAllBranches);
router.get("/:branchId", AdminBranchesController.getBranchDetails);
router.post("/", AdminBranchesController.addBranch);
router.put("/:branchId", AdminBranchesController.updateBranch);
router.delete("/:branchId", AdminBranchesController.deleteBranch);
router.patch("/:branchId/:status", AdminBranchesController.updateStatus);

export default router;
