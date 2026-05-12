import express from "express";
import AdminAuthController from "./auth.controller.js";
import verifyToken, {
  authorizeRoles,
} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, authorizeRoles("admin"), AdminAuthController.me);
router.post("/login", AdminAuthController.login);
router.post("/logout", AdminAuthController.logout);

export default router;
