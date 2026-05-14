import express from "express";
import { StoreAuthValidation as validate } from "./auth.validation.js";
import { StoreAuthController as controller } from "./auth.controller.js";
import verifyToken, {
  authorizeRoles,
} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, authorizeRoles("branch"), controller.me);
router.post("/login", validate.login, controller.login);
router.post(
  "/logout",
  verifyToken,
  authorizeRoles("branch"),
  controller.logout,
);

export default router;
