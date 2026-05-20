import express from "express";
import * as controller from "./menu.controller.js";

const router = express.Router();

router.get("/", controller.getAllMenu);
router.get("/:productId", controller.getMenuDetails);
router.patch("/:productId/availability", controller.updateMenuStatus);

export default router;
