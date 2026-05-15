import express from "express";
import * as controller from "./auth.controller.js";
import * as validate from "./auth.validation.js";

const router = express.Router();

router.post("/register", validate.register, controller.register);
router.post("/login", validate.login, controller.login);

export default router;
