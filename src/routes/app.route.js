import express from "express";
import appAuthRoutes from "../modules/app/auth/auth.routes.js";

const router = express.Router();

router.use("/auth", appAuthRoutes);

export default router;
