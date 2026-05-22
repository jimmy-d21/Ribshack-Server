import express from "express";
import * as controller from "./notification.controller.js";

const router = express.Router();

router.get("/", controller.getAllNotifications);

export default router;
