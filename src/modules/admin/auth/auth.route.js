import express from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { adminLoginSchema } from "./auth.schema.js";
import verifyToken, {
  authorizeRoles,
} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, authorizeRoles("admin"), controller.me);
router.post("/login", validate(adminLoginSchema), controller.login);
router.post("/logout", verifyToken, authorizeRoles("admin"), controller.logout);

export default router;
