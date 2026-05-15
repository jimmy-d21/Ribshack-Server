import express from "express";
import appAuthRoutes from "../modules/app/auth/auth.routes.js";
import appBranchRoutes from "../modules/app/branches/branch.route.js";
import verifyToken, { authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", appAuthRoutes);
router.use(
  "/branches",
  verifyToken,
  authorizeRoles("customer"),
  appBranchRoutes,
);

export default router;
