import express from "express";
import storeAuthRoutes from "../modules/store/auth/auth.route.js";

const router = express.Router();

router.use("/auth", storeAuthRoutes);

export default router;
