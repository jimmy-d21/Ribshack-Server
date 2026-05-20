import express from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { storeLoginSchema } from "./auth.schema.js";
import verifyToken, {
  authorizeRoles,
} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, authorizeRoles("branch"), controller.me);
router.post("/login", validate(storeLoginSchema), controller.login);
router.post(
  "/logout",
  verifyToken,
  authorizeRoles("branch"),
  controller.logout,
);

export default router;
