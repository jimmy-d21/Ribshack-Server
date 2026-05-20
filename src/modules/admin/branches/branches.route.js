import express from "express";
import * as controller from "./branches.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { createBranchSchema, updateBranchSchema } from "./branches.schema.js";

const router = express.Router();

router.get("/", controller.getAllBranches);
router.get("/:branchId", controller.getBranchDetails);
router.get("/:branchId/analytics", controller.getBranchAnalytics);
router.post("/", validate(createBranchSchema), controller.createBranch);
router.put("/:branchId", validate(updateBranchSchema), controller.updateBranch);
router.delete("/:branchId", controller.deleteBranch);
router.patch("/:branchId/:status", controller.updateBranchStatus);

export default router;
