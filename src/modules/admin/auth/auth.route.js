import express from "express";
import AdminAuthController from "./auth.controller.js";

const router = express.Router();

router.post("/login", AdminAuthController.login);

export default router;
