import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./notification.service.js";

export const getAllNotifications = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const notifications = await service.getAllNotifications(branchId);
  return res.status(200).json({ success: true, notifications });
});

export const updateNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const updatedNotification = await service.updateNotification(notificationId);

  return res.status(200).json({
    success: true,
    data: updatedNotification,
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  await service.markAllAsRead(branchId);
  return res.status(200).json({
    success: true,
    message: "All notifications marked as read successfully",
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  await service.deleteNotification(notificationId);

  return res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});

export const deleteAllNotification = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  await service.deleteAllNotification(branchId);
  return res.status(200).json({
    success: true,
    message: "All notifications deleted successfully",
  });
});
