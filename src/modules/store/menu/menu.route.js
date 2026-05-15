import express from "express";
import * as controller from "./menu.controller.js";
import * as validate from "./menu.validation.js";

const router = express.Router();

router.get("/", controller.getAllMenu);
router.get("/:productId", validate.getMenuDetails, controller.getMenuDetails);
router.patch(
  "/:productId/availability",
  validate.updateMenuStatus,
  controller.updateMenuStatus,
);

export default router;
