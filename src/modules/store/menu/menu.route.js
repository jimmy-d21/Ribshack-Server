import express from "express";
import * as controller from "./menu.controller.js";

const router = express.Router();

router.get("/", controller.getAllMenu);

export default router;
