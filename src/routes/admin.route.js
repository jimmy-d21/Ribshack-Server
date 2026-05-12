import express from "express";
import adminAuthRoutes from "../modules/admin/auth/auth.route.js";
import adminBranchRoutes from "../modules/admin/branches/branches.route.js";

const router = express.Router();

router.use("/auth", adminAuthRoutes);
router.use("/branches", adminBranchRoutes);

export default router;
