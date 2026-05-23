import express from "express";
import * as controller from "./notification.controller.js";

const router = express.Router();

router.get("/", controller.getAllNotifications);
router.patch("/read-all", controller.markAllAsRead);
router.patch("/:notificationId", controller.updateNotification);
router.delete("/:notificationId", controller.deleteNotification);

export default router;
