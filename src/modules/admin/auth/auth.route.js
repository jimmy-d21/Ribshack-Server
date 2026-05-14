import express from "express";
import { AdminAuthController as controller } from "./auth.controller.js";
import { AdminAuthValidation as validate } from "./auth.validation.js";
import verifyToken, {
  authorizeRoles,
} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, authorizeRoles("admin"), controller.me);
router.post("/login", validate.login, controller.login);
router.post("/logout", verifyToken, authorizeRoles("admin"), controller.logout);

export default router;
