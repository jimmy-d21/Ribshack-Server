import express from "express";
import verifyToken from "../../../middlewares/admin/auth.middleware.js";
import AdminBranchesController from "./branches.controller.js";

const router = express.Router();

router.get("/", verifyToken, AdminBranchesController.getAllBranches);
router.get("/:branchId", verifyToken, AdminBranchesController.getBranchDetails);
router.post("/", verifyToken, AdminBranchesController.addBranch);
router.put("/:branchId", verifyToken, AdminBranchesController.updateBranch);
router.delete("/:branchId", verifyToken, AdminBranchesController.deleteBranch);
router.patch(
  "/:branchId/:status",
  verifyToken,
  AdminBranchesController.updateStatus,
);

export default router;
