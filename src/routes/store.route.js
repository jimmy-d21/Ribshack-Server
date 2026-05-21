import express from "express";
import storeAuthRoutes from "../modules/store/auth/auth.route.js";
import storeDashboardRoutes from "../modules/store/dashboard/dashboard.route.js";
import storeInventoryRoutes from "../modules/store/inventory/inventory.route.js";
import storeMenuRoutes from "../modules/store/menu/menu.route.js";
import verifyToken, { authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", storeAuthRoutes);
router.use(
  "/dashboard",
  verifyToken,
  authorizeRoles("branch"),
  storeDashboardRoutes,
);
router.use(
  "/inventory",
  verifyToken,
  authorizeRoles("branch"),
  storeInventoryRoutes,
);
router.use("/menu", verifyToken, authorizeRoles("branch"), storeMenuRoutes);

export default router;
