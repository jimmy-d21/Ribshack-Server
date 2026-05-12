import express from "express";
import verifyToken from "../../../middlewares/admin/auth.middleware.js";
import AdminBranchesController from "./branches.controller.js";

const router = express.Router();

router.get("/", verifyToken, AdminBranchesController.getAllBranches);
router.post("/", verifyToken, AdminBranchesController.addBranch);
router.put("/:branchId", verifyToken, AdminBranchesController.updateBranch);

export default router;
