import express from "express";
import { StoreAuthValidation as validate } from "./auth.validation.js";
import { StoreAuthController as controller } from "./auth.controller.js";

const router = express.Router();

router.post("/login", validate.login, controller.login);

export default router;
