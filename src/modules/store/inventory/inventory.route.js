import express from "express";
import * as controller from "./inventory.controller.js";

const router = express.Router();

router.get("/", controller.getAllInventory);

export default router;
