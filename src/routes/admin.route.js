import express from "express";
import adminAuthRoutes from "../modules/admin/auth/auth.route.js";

const router = express.Router();

router.use("/auth", adminAuthRoutes);

export default router;
