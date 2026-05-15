import express from "express";
import * as controller from "./branch.controller.js";

const router = express.Router();

router.get("/", controller.getAllAvailableBranches);
router.get("/:branchId/menu", controller.getAllBranchMenu);

export default router;
