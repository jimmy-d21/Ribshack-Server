import express from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import verifyToken, {
  authorizeRoles,
} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, authorizeRoles("customer"), controller.me);
router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);

export default router;
