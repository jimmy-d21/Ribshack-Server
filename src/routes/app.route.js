import express from "express";
import appAuthRoutes from "../modules/app/auth/auth.routes.js";
import appBranchRoutes from "../modules/app/branches/branch.route.js";
import appHomeRoutes from "../modules/app/home/home.route.js";
import appProductRoutes from "../modules/app/products/product.route.js";
import appCartRoutes from "../modules/app/carts/cart.route.js";
import appAddressRoutes from "../modules/app/address/address.route.js";
import appOrdersRoutes from "../modules/app/orders/order.route.js";
import appNotificationRoutes from "../modules/app/notification/notification.route.js";
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
router.use("/cart", verifyToken, authorizeRoles("customer"), appCartRoutes);
router.use(
  "/addresses",
  verifyToken,
  authorizeRoles("customer"),
  appAddressRoutes,
);
router.use("/orders", verifyToken, authorizeRoles("customer"), appOrdersRoutes);
router.use(
  "/notifications",
  verifyToken,
  authorizeRoles("customer"),
  appNotificationRoutes,
);

export default router;
