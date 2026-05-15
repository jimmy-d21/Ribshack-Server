import express from "express";
import * as controller from "./auth.controller.js";
import * as validate from "./auth.validation.js";

const router = express.Router();

router.post("/register", validate.register, controller.register);

export default router;
