import express from "express";
import AdminAuthController from "./auth.controller.js";
import verifyToken from "../../../middlewares/admin/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, AdminAuthController.me);
router.post("/login", AdminAuthController.login);
router.post("/logout", AdminAuthController.logout);

export default router;
