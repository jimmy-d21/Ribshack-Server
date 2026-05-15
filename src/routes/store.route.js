import express from "express";
import storeAuthRoutes from "../modules/store/auth/auth.route.js";
import storeInventoryRoutes from "../modules/store/inventory/inventory.route.js";
import storeMenuRoutes from "../modules/store/menu/menu.route.js";
import verifyToken, { authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", storeAuthRoutes);
router.use(
  "/inventory",
  verifyToken,
  authorizeRoles("branch"),
  storeInventoryRoutes,
);
router.use("/menu", verifyToken, authorizeRoles("branch"), storeMenuRoutes);

export default router;
