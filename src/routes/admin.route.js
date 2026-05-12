import express from "express";
import adminAuthRoutes from "../modules/admin/auth/auth.route.js";
import adminBranchRoutes from "../modules/admin/branches/branches.route.js";
import adminInventoryRequestRoutes from "../modules/admin/inventory-requests/inventoryRequest.route.js";
import verifyToken, { authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", adminAuthRoutes);
router.use(
  "/branches",
  verifyToken,
  authorizeRoles("admin"),
  adminBranchRoutes,
);
router.use(
  "/inventory-requests",
  verifyToken,
  authorizeRoles("admin"),
  adminInventoryRequestRoutes,
);

export default router;
