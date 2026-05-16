import express from "express";
import appAuthRoutes from "../modules/app/auth/auth.routes.js";
import appBranchRoutes from "../modules/app/branches/branch.route.js";
import appHomeRoutes from "../modules/app/home/home.route.js";
import appProductRoutes from "../modules/app/products/product.route.js";
import verifyToken, { authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", appAuthRoutes);
router.use(
  "/branches",
  verifyToken,
  authorizeRoles("customer"),
  appBranchRoutes,
);
router.use("/home", verifyToken, authorizeRoles("customer"), appHomeRoutes);
router.use(
  "/products",
  verifyToken,
  authorizeRoles("customer"),
  appProductRoutes,
);

export default router;
